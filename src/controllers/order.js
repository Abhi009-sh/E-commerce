import {Order} from '../modules/order.js';
import {Product} from '../modules/product.js';
import mongoose from 'mongoose';
import {asynchandler} from '../utils/asynchandler.js';
import {ApiResponse} from '../utils/apiresponse.js';
import {ApiError} from '../utils/apierror.js';

/* create order
   get order by  id
   get all order for admin
   marked order as delivered
    marked order as  paid
    */
   const createOrder=asynchandler(async(req,res)=>{
            const {orderItems,shippingAddress,paymentMethod,totalPrice,taxPrice       
            }=req.body;
       
            if(!orderItems||orderItems.length===0){
               throw new ApiError(400,'no order items found');
            }
            if(!req.user || !req.user._id){
               throw new ApiError(401,'authentication required');
            }
 const order=await Order.create({
   userId:req.user._id,
   orderItems,shippingAddress,paymentMethod,totalPrice,taxPrice     
 })

return res.status(201).json(new ApiResponse(201,'order created successfully',order));

   }) 
   const getOrderById=asynchandler(async(req,res)=>{
      const {orderId}=req.params;
      if(!mongoose.Types.ObjectId.isValid(orderId)){
         throw new ApiError(400,'invalid order id');
      }
      const order=await Order.findById(orderId).populate('userId','name email');
      if(!order){
         throw new ApiError(404,'order not found');

      }
      // only owner or admin can fetch order
      if(!req.user || (order.userId._id.toString() !== req.user._id.toString() && !req.user.isAdmin)){
         throw new ApiError(403,'forbidden');
      }
      return res.status(200)
      .json(new ApiResponse(200,'order fetched successfully',order));
   })
   const getAllOrdersForAdmin=asynchandler(async(req,res)=>{
      if(!req.user || !req.user.isAdmin){
         throw new ApiError(403,'admin access required');
      }
      const orders=await Order.find().populate('userId','name email');
      if(!orders || orders.length===0){
         throw new ApiError(404,'no orders found');
      }
      return res.status(200)
      .json(new ApiResponse(200,'All orders fetched successfully',orders));
   })
   const markOrderAsPaid=asynchandler(async(req,res)=>{
      const {orderId}=req.params;
      if(!mongoose.Types.ObjectId.isValid(orderId)){
         throw new ApiError(400,'invalid order id');
      }
      const order=await Order.findById(orderId);
      if(!order){
         throw new ApiError(404,'order not found');
      }
      // only owner or admin can mark as paid
      if(!req.user || (order.userId?.toString() !== req.user._id.toString() && !req.user.isAdmin)){
         throw new ApiError(403,'forbidden');
      }
      order.isPaid=true;
      order.paidAt=Date.now();
      order.status='Processing';
      await order.save();
      return res.status(200)
      .json(new ApiResponse(200,'order paid successfully by customer',order));
   })
   const markOrderAsDelivered=asynchandler(async(req,res)=>{
      const {orderId}=req.params;
      if(!mongoose.Types.ObjectId.isValid(orderId)){
         throw new ApiError(404,'invalid order id');
      }
      const order=await Order.findById(orderId);
      if(!order){
         throw new ApiError(404,'order not found');
      }
      // only admin can mark delivered
      if(!req.user || !req.user.isAdmin){
         throw new ApiError(403,'admin access required');
      }
      order.isDelivered=true;
      order.status="Delivered";
      await order.save();

      return res.status(200)
      .json(new ApiResponse(200,'order marked as delivered successfully',order));
   })

   export {
      createOrder,
      getOrderById,
      getAllOrdersForAdmin,
      markOrderAsPaid,
      markOrderAsDelivered
   }