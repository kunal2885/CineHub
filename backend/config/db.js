import mongoose from "mongoose"

const connectDb = async ()=>{
    try{
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("successfully connect to our database")

    }catch(error){
        console.error(`can't connect to mongodb error: ${error.message}`)
        process.exit(1)
    }
}
export default connectDb