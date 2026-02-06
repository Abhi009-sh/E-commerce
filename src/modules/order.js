import mongoose from 'mongoose';
 const orderSchema=new mongoose.Schema({
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    required:true,
  },
  orderItems:[{
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product',
        required:true,
    },
    quantity:{
        type:Number,
        required:true,
    }

  }],
  shippingAddress:{
    address:String,
    city:String,
    postalCode:String,
    country:String,
  },
  paymentMethod:{
      type:String,
      required:true,
  },
   totalPrice:{
    type:Number,
    required:true,
   },
   isPaid:{
    type:Boolean,
    default:false,
   },
   isDelivered:{
    type:Boolean,
    default:false,
   }, 
   itemPrice:Number,
   taxPrice:Number,
   shippingPrice:Number,
   totalPrice:Number,
   status:{
    type:String,
    enum:['Pending','Processing','Shipped','Delivered','Cancelled'],
    default:'Pending',
   }
  
 },{
    timestamps:true,
 })
 export const Order=mongoose.model('Order',orderSchema);