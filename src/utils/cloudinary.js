import dotenv from "dotenv";
dotenv.config({ path: '.env' });


import { v2 as cloudinary } from "cloudinary";
import fs from "fs";


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("Cloudinary credentials:", {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET ? "exists" : "MISSING"
});

const uploadOnCloudinary = async (filePath, folder) => {
    try {        
        if(!filePath) return null;
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto",
        });
        //console.log("File uploaded successfully. URL:", result.secure_url);
        fs.unlinkSync(filePath); //remove the locally saved temporary file after successful upload
        return result;
    
    }catch(error){
        fs.unlinkSync(filePath); //remove the locally saved temporary file as the  upload operation got failed
        console.error("Error uploading file to Cloudinary:", error);
        return null;
    }
};


export { uploadOnCloudinary };