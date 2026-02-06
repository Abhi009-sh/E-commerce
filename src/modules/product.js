import mongoose from 'mongoose';
const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    descriptions:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    countInStock:{
        type:Number,
        required:true,
    },
    imageUrl:{
        type:String,
        required:false,
    }

},{
    timestamps:true,
})


export const Product=mongoose.model('Product',productSchema);