import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const DB_NAME = process.env.DB_NAME || "videotube"; // ← get from env
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URI}/${DB_NAME}`
        );    
        console.log(`Connected to MongoDB !! DB HOST : ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }  
}

export default connectDB;