const mongoose =require('mongoose')

const paymentSchema=new mongoose.Schema({
    user_id:{
        type:String,
        required: true,
    },
    name: {
        trype: String,
        required: true
    },
    email: {
        trype: String,
        required: true
    },
    paymentId: {
        trype: String,
        required: true
    },
    address: {
        trype: String,
        required: true
    },
    cart: {
        trype: Array,
        default: []
    },
    status: {
        trype: Boolean,
        default: false
    },
}, {
    timestamps: true
})

module.exports = mongoose.model("Payments", paymentSchema)