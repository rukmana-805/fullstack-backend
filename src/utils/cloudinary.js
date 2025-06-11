import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});


// Upload file to cloudinnary using the localFilePath of that particular assert
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null
        //upload file in cloudinary
        const responce = await cloudinary.uploader.upload(localFilePath, {
            resource_type : "auto"  //Which type of data you want to upload like pdf, image or vdo etc auto for everything allowed
        })
        //file has been uploaded successfully
        //console.log("File is uploaded on cloudinary", responce.url)
        fs.unlinkSync(localFilePath);
        console.log("Responce : ",responce);
        return responce;

    } catch (error) {
        if(fs.existsSync(localFilePath)){
            fs.unlinkSync(localFilePath) //remove the locally saved temporary files as the upload operation got failed
            return null;
        }
    }
}

export {uploadOnCloudinary}