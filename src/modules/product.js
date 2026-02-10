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
    },
        category:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Category',
            required:true,
        },
        brand:{
            type:String,
        },
        rating:{
            type:Number,
            default:0,
        },
        numReviews:{
            type:Number,
            default:0,

        },
        reviews:[{
            useId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'User',
                
            },
            name:String,
            rating:Number,
            comment:String,
        }]
    

},{
    timestamps:true,
})


export const Product=mongoose.model('Product',productSchema);