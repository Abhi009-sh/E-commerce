import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
import {ApiError} from './apierror.js';

const removeCloudinaryFile=async(url,resource_type)=>{
    try {
     const getPublicIdFromUrl=extrackPublicId(url);
     const response =await cloudinary.uploader.destroy(getPublicIdFromUrl,{
        resrouce_type:resource_type || 'image'
     })   
     return response;

    } catch (error) {
        throw new ApiError(500,'Cloudinary file removal failed');
        
        
    }


}
export{removeCloudinaryFile};