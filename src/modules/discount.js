const discountSchema=new mongoose.Schema({
    code:{
        type:String,
        required:true,
        unique:true,
    },
    discountPercentage:Number,
    expiryDate:Date,
    isActive:{
        type:Boolean,
        default:true,
    }

},{
    timestamps:true,
})
export const Discount=mongoose.model('Discount',discountSchema);