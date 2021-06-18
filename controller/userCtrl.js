const Users = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userCtrl = {
    register: async (req, res) => {
        try {
            //Obtener los datos del usuario y su existencia previa
            const { name, email, password } = req.body;
            const user = await Users.findOne({ email })

            //Validar existencia y tamaño de clave
            if (user) res.status(400).json({ msg: "El email ya existe" })
            if (password.length < 6) res.status(400).json({ msg: "La contraseña debe tener al menos 6 caracteres" })

            //Password Encription
            const passwordHash = await bcrypt.hash(password, 10)
            const newUser = new Users({
                name,
                email,
                password: passwordHash,
            })

            //Save mongoDB
            await newUser.save()

            //Despues crear el jsonwebtoken
            const accesstoken = createAccessToken({ id: newUser._id })
            const refreshtoken = createRefreshToken({ id: newUser._id })

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token'
            })

            res.json({ accesstoken })
            //res.json({msg: "Guardado exitoso" })

            //VER EL USUARIO CREADO res.json(newUser)
            //VER EL HASH GENERADO CON LA SEMILLA 10: res.json({password, passwordHash })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await Users.findOne({ email })
            if (!user) return res.status(400).json({ msg: "Usuario inexistente" })

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) return res.status(400).json({ msg: "Clave erronea" })

            //If login success, craete access Token and refresh
            const accesstoken = createAccessToken({ id: user._id })
            const refreshtoken = createRefreshToken({ id: user._id })

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token'
            })

            res.json({ accesstoken })
            //res.json({ msg: "login correcto" })

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken', { path: '/user/refresh_token' })
            return res.json({ msg: "Logged out" });
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    refreshToken: (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken;
            if (!rf_token) return res.status(400).json({ msg: "Plase Login or register" })

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if (err) return res.status(400).json({ msg: "Plase Login or register" })
                const accesstoken = createAccessToken({ id: user.id })
                //res.json({user, accesstoken})
                res.json({ accesstoken })
            })

            //res.json({ rf_token })
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }

    },
    getUser: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id).select('-password')
            //res.json(req.user)            
            if (!user) return res.status(400).json({ msg: "usuario no existe" })
            res.json(user)

        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    },
    addCart: async (req, res) => {
        try {
            const user = await Users.findById(req.user.id)
            if (!user) return res.status(400).json({msg: "No existe usuario"})

            await Users.findOneAndUpdate({_id: req.user.id}, {
                cart: req.body.cart
            })

            return res.json({msg: "Added to cart"})
        } catch (err) {
            return res.status(500).json({ msg: err.message })
        }
    }


}

const createAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
}
const createRefreshToken = (user) => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })
}

module.exports = userCtrl