//require('dotenv').config(); // Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config({ path: './.env' }); // MUST be first before all other imports

import { setDefaultResultOrder } from 'dns';
setDefaultResultOrder('ipv4first');

import connectDB from './db/index.js';
import { app } from './app.js';

console.log('MONGODB_URI:', process.env.MONGODB_URI);

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port ${process.env.PORT || 8000}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
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