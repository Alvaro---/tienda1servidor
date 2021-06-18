const User = require('../models/userModel')

const authAdmin = async (req, res, next) => {
    try {
        //get User information by id
        const user=await User.findOne({
            _id:req.user.id
        })
        if (user.role===0)
            return res.status(400).json({msg: "Admin resources access deniedd"})
        next()
    } catch (err) {
        return res.status(500).json({ mgs: err.message })
    }
}

module.exports = authAdmin