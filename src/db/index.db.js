import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDb = async () => {
    try {
        const connectInstance = await mongoose.connect(`${process.env.MONGOdB_URI}/${DB_NAME}`)
        console.log(`\n MongoDb is connected ! DB HOST: ${connectInstance.connection.host}`)
    } catch (error) {
        console.log("mongoodb connection error: ", error)
        process.exit(1)
    }
}

export default connectDb