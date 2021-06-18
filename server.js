require('dotenv').config();
const express=require('express');
const mongoose= require('mongoose');
const cors=require('cors');
const fileUpload=require('express-fileupload');
const cookieParser=require('cookie-parser');

//Iniciar Servidor
const app=express()

//MIDDELEWARES
app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(fileUpload({
    useTempFiles: true
}))

//Routes
app.use('/user', require('./routes/userRouter'))
app.use('/api', require('./routes/categoryRouter'))
app.use('/api', require('./routes/upload'))
app.use('/api', require('./routes/productRouter'))
app.use('/api', require('./routes/paymentRouter'))


//connect to mongo
const URI=process.env.MONGODB_URL
mongoose.connect (URI,{
    useCreateIndex:true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, err=>{
    if (err) throw err;
    console.log('Conectado a la BD')
})

const PORT = process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log('Running in port', PORT)
})

