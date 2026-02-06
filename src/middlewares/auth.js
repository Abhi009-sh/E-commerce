import {ApiError} from '../utils/apierror.js';
import {asynchandler} from '../utils/asynchandler.js';
import jwt from 'jsonwebtoken';
import {User} from '../modules/user.js'

export const auth = asynchandler(async (req, res, next) => {
   try {
      const authHeader = req.headers?.authorization || req.get('Authorization');
      const tokenFromHeader = authHeader ? authHeader.replace('Bearer ', '').trim() : null;
      const token = req.cookies?.accessToken || tokenFromHeader;

      if (!token) {
         throw new ApiError(401, 'Unauthorized token');
      }

      if (!process.env.ACCESS_TOKEN_SECRET) {
         throw new ApiError(500, 'server misconfiguration: ACCESS_TOKEN_SECRET is not set');
      }

      let decoded;
      try {
         decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      } catch (err) {
         if (err.name === 'TokenExpiredError') {
            throw new ApiError(401, 'access token expired');
         }
         if (err.name === 'JsonWebTokenError') {
            throw new ApiError(401, 'invalid access token');
         }
         throw err;
      }

      const user = await User.findById(decoded?._id).select('-password -refreshToken');

      if (!user) {
         throw new ApiError(401, 'invalid access token');
      }

      req.user = user;
      next();
   } catch (error) {
      if (error instanceof ApiError) throw error;
      console.error('auth middleware error:', error);
      throw new ApiError(401, 'unauthorized authentication failed');
   }
});