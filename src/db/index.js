import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        //console.log(process.env.MONGODB_URI);
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}`,{
            dbName: DB_NAME,  // Correctly pass the database name here
        }) //url/dbname
        console.log(`\n MongoDB connected !! DB HOST : ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log("MONGODB connection FIALED",error.message)
        console.log("Full error message", error)
        process.exit(1)
    }
}

export default connectDB