//require('dotenv').config(); // Load environment variables from .env file
import { setDefaultResultOrder } from 'dns';
setDefaultResultOrder('ipv4first');
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { DB_NAME } from './constants.js';  
import connectDB from './db/index.js';

dotenv.config({
    path: '.env'
}); // Load environment variables from .env file


console.log('MONGODB_URI:', process.env.MONGODB_URI);
console.log('DB_NAME:', DB_NAME);


connectDB(); // Connect to the database 

.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on port ${process.env.PORT || 8000}`);  
      })
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit the process with an error code    
});

/*
import express from 'express';
const app = express();

( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error", (error) => {
            console.error('Error connecting to MongoDB:', error);
            throw error;
        });
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);   
    });
    }
    catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }   
})();
*/