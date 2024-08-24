import mongoose from 'mongoose'
mongoose.set('strictQuery',false)
export const connectToDB=()=>{
    mongoose.connect(process.env.MONGO_URI)
    .then((conn)=>console.log(`connect to mongodb successfully:- ${conn.connection.host}`))
    .catch((err)=>console.log(err)) 
}