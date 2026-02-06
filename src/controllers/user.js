import {User} from '../modules/user.js';
import {asynchandler} from '../utils/asynchandler.js'
import {ApiError} from '../utils/apierror.js';
import {ApiResponse} from '../utils/apiresponse.js';
import jwt from 'jsonwebtoken';







const generateRefreshAndAccessToken=async(userId)=>{
 try {
    const user=await User.findById(userId);
    const refreshToken=user.generateRefreshToken();
    const accessToken=user.generateAccessToken();
    user.refreshToken=refreshToken;
    await user.save({validateBeforeSave:false});
    return {refreshToken,accessToken};

 } catch (error) {
    throw new ApiError(500,'unable to generate access and refresh token');
 }
}

const userRegister=asynchandler(async(req,res)=>{
   const {email,password,username}=req.body;
   if([username,email,password].some((field)=>field?.trim()=='')){
      throw new ApiError(400,'all fields are required');
   }
     
   const existingUser=await User.findOne({
      $or:[{username},{email}]
   })
   if(existingUser)
{
   throw new ApiError(400,'user with name or email already exits');
}

const user=await User.create({
   email,password,username
});
const createdUser=await User.findById(user._id).select('-password -refreshToken');
if(!createdUser){
   throw new ApiError(500,'unable to create user');
}
return res.status(201).json(new ApiResponse(201,'user created successfully',createdUser));





})
const loginUser=asynchandler(async(req,res)=>{
   const {email,username,password}=req.body;
     if(!(email||username)){
      throw new ApiError(400,'either email or username is required to login');
     }
       if(!password || password?.trim()===''){
          throw new ApiError(400,'password is required to login');
       }

const user=await User.findOne({
   $or:[{email},{username}]
}).select('+password -refreshToken');
if(!user){
   throw new ApiError(404,'user not found');
}
const isPasswordMatched=await user.isPasswordMatch(password);
console.log('login: incoming password:', JSON.stringify(password));
console.log('login: stored hash:', user.password);
console.log('login: bcrypt compare result before log:', isPasswordMatched);
console.log(isPasswordMatched);
if(!isPasswordMatched){
   throw new ApiError(401,'invalid credentials');
}
const {accessToken, refreshToken}=await generateRefreshAndAccessToken(user._id);
const logInUser=await User.findById(user._id).select('-password -refreshToken');
const options={
   httpOnly:true,
   secure:false,
   sameSite:'lax'
}
return res.status(200)
          .cookie('refreshToken',refreshToken,options)
          .cookie('accessToken',accessToken,options)
          .json(new ApiResponse(200,'user logged in successfully',logInUser));




})
const logoutUser=asynchandler(async(req,res)=>{
 await User.findByIdAndUpdate(req.user._id,{
   $unset:{
      refreshToken:1
   }
 },{
   new:true,
 })
 const options={
   httpOnly:true,
   secure:false,
   sameSite:'lax'
 }

 return res.status(200)
.clearCookie('refreshToken',options)
.clearCookie('accessToken',options)
.json(new ApiResponse(200,'user logged out successfully',null));



})
const refreshAccessToken=asynchandler(async(req,res)=>{
    const incommingRefreshToken=req.cookies.refreshToken || req.body.refreshToken;
    if(!incommingRefreshToken){
      throw new ApiError(400,'refresh token is required');
    }
    try {
      const decodedRefreshToken=jwt.verify(incommingRefreshToken,process.env.REFRESH_TOKEN_SECRET);
      const user=await User.findById(decodedRefreshToken?._id);
         if(!user){
            throw new ApiError(404,'user not found');
         }
         if(!user.refreshToken){
            throw new ApiError(401,'user is logged out please login again baby');
         }
         if(user.refreshToken!==incommingRefreshToken){
            throw new ApiError(401,'invalid refresh token baby');
         }
         const options={
            httpOnly:true,
            secure:false,
         }
         const {accessToken,refreshToken}=await generateRefreshAndAccessToken(user._id);
         return res.status(200)
         .cookie('refreshToken',refreshToken,options)
         .cookie('accessToken',accessToken,options)
         .json(new ApiResponse(200,'access token refreshed successfully'));

    } catch (error) {
      throw new ApiError(401,'invalid refresh token generated babay');
    }





})

const changeCurrentPassword=asynchandler(async(req,res)=>{
    const {oldPassword,newPassword}=req.body;
    const user=await User.findById(req.user._id).select('+password');
    if(!user){
      throw new ApiError(404,'user not found');
    }
   const isPasswordMatch=await user.isPasswordMatch(oldPassword);
   if(!isPasswordMatch){
      throw new ApiError(401,'password doesnot matched');
   }
    user.password=newPassword;
    await user.save({validateBeforeSave:false});
    return res
    .status(200)
    .json(new ApiResponse(200,'password changed successfully'));



})
export{
   userRegister,
   loginUser,
   logoutUser,
   refreshAccessToken,
  changeCurrentPassword
}