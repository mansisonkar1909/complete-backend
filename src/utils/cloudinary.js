import { v2 as cloudianry } from "cloudinary";
import fs from "fs";

cloudianry.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (filePath, folder) => {
    try {        
        if(!localFilePath) return null;
        const result = await cloudianry.uploader.upload(filePath, {
            resource_type: "auto",
        });
        console.log("File uploaded successfully. URL:", result.secure_url);
        return result;
    
    }catch(error){
        fs.unlinkSync(filePath); //remove the locally saved temporary file as the  upload operation got failed
        console.error("Error uploading file to Cloudinary:", error);
        return null;
    }
};


export { uploadOnCloudinary };