/* create product
get all product 
get single product
update product by admin
delete product
*/
import {asynchandler} from '../utils/asynchandler.js';
import {ApiResponse} from '../utils/apiresponse.js';
import {ApiError} from '../utils/apierror.js';
import {Product}  from '../modules/product.js';
import {uploadOnCloudinary} from '../utils/cloudinary.js';
import mongoose from 'mongoose';
const createProduct=asynchandler(async(req,res)=>{
 const {name,descriptions,price,countInStock}=req.body || {};

   if(!name||!price||!countInStock){
    throw new ApiError(400,'name,price and countInStock are required');

   }
   let imageUrlPath=null;
   if(req.files?.imageUrl?.length){
     imageUrlPath=req.files.imageUrl[0].path
   }else{
    throw new ApiError(400,'product image is required');
   }
   if(!imageUrlPath){
    throw new ApiError(400,'product image is missing');
   }
   const image=await uploadOnCloudinary(imageUrlPath,'product');
   if(!image){
    throw new ApiError(500,'failed to upload product image');
   }

   const product=await Product.create({
    name,descriptions,price,countInStock,imageUrl,createdBy:req.user._id
   })

   return res
   .status(201)
   .json(new ApiResponse(201,'product created successfully',product));
})
    const getAllProducts=asynchandler(async(req,res)=>{
        const products=await Product.find();
        return res
        .status(200)
        .json(new ApiResponse(200,'products created successfully',products));
    })
    const getSingleProduct=asynchandler(async(req,res)=>{
         const {productId}=req.params;
         if(!mongoose.Types.ObjectId.isValid(productId)){
            throw new ApiError(400,'invalid product id');
         }
        const product=await Product.findById(productId);
         if(!product){
            throw new ApiError(404,'product not found');

         }
    return res
    .status(200)
    .json(new ApiResponse(200,'single product fetched successfully',product));





    })
    const updateProductByAdmin=asynchandler(async(req,res)=>{
        const {productId}=req.params;
        if(!mongoose.Types.ObjectId.isValid(productId)){
            throw new ApiError(400,'invalid product id');
        }
        if(!req.body || Object.keys(req.body).length === 0){
            throw new ApiError(400,'no update data provided');
        }
        const product=await Product.findByIdAndUpdate(productId,{
            $set:req.body
        },{
            new:true,
        })
        if(!product){
            throw new ApiError(404,'product not found');
        }
        return res
        .status(200)
        .json(new ApiResponse(200,'product updated successfully',product));

    })
    const deleteProductByAdmin=asynchandler(async(req,res)=>{
        const {productId}=req.params;
        if(!mongoose.Types.ObjectId.isValid(productId)){
            throw new ApiError(400,'invalid product id');
        }
        const product=await Product.findByIdAndDelete(productId);
        if(!product){
            throw new ApiError(404,'product not found');
        }
        return res
        .status(200)
        .json(new ApiResponse(200,'product deleted successfully',null));
    })
    export{
        createProduct,
        getAllProducts,
        getSingleProduct,
        updateProductByAdmin,
        deleteProductByAdmin
    }