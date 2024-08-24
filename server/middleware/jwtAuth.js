import jwt from 'jsonwebtoken';
import AppError from '../utils/error.utils.js';

export const isLoggedin =async(req,res,next)=>{
    try {
        const token =  req.cookies?.token; 

        if (!token) {
            return next(new AppError("Unauthenticated, please login again", 401));
        }

        const userDetails = await jwt.verify(token,process.env.SECRET);
        req.user = userDetails;
        next();
    } catch (error) {
        return next(new AppError("Unauthenticated, please login again", 401));
    }
}