const router = require('express').Router()
const cloudinary = require('cloudinary')
const auth = require('../middleware/auth')
const authAdmin = require('../middleware/authAdmin')
const fs = require('fs')

//Update Image on cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
})

//upload image
router.post('/upload', auth, authAdmin, (req, res) => {
    try {
        console.log(req.files)
        if (!req.files || Object.keys(req.files).length === 0)
            return res.status(400).json({ msg: 'No files were uploaded' })

        const file = req.files.file;
        if (file.size > 1024 * 1024) { //1024*1024 = 1mb  .... 1024*124*5=5mb if file.size>1mb
            removeTmp(file.tempFilePath)
            return res.status(400).json({ msg: "Tamaño muy largo" })
        }

        if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
            removeTmp(file.tempFilePath)
            return res.status(400).json({ msg: "Formato incorrecto" })
        }


        cloudinary.v2.uploader.upload(file.tempFilePath, { folder: "test" }, async (err, result) => {
            if (err) throw err;
            removeTmp(file.tempFilePath)
            //res.json({result})
            //after upload will have tmp. Si no hay tmp no sube. 
            res.json({ public_id: result.public_id, url: result.secure_url })
        })

        //res.json('test upload')
        //El archivos e sube a una carpeta tmp que se crea automaticamente y se puede ver aqui
    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
})

//Delete Image
router.post('/destroy', auth, authAdmin, (req, res) => {
    try {
        const { public_id } = req.body;
        if (!public_id) return res.status(400).json({ msg: "No hay imagen que eliminar" })
        
        cloudinary.v2.uploader.destroy(public_id, async(err,result)=>{
            if(err) throw err;
            res.json({msg:"imagen destruida"})
        })
    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }

})

const removeTmp = (path) => {
    fs.unlink(path, err => {
        if (err) throw err;
    })
}

module.exports = router