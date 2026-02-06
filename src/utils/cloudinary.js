import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
});
const uploadOnCloudinary=async(localFilePath)=>{
  try {
    if(!localFilePath) return null;
    const response=await cloudinary.uploader.upload(localFilePath,{
        resource_type:'auto',
        folder:'e-commerce',
        transformation:[
            {
                width:500,height:500,crop:'limit'
            },{
                qualtiy:'auto'
            }
        ]
    });
    fs.unlinkSync(localFilePath);
    return response
  } catch (error) {
    fs.unlinkSync(localFilePath);
    console.error('error while uploading on cloudinary',error);
    return null;
    
  }


}
export {uploadOnCloudinary};