import User from "../models/user.model.js";
import cloudinary from "cloudinary";
import AppError from "../utils/error.utils.js";
import fs from "fs/promises";
import validator from 'email-validator'
export const test = (req, res, next) => {
  res.send("<h1>Hello!</h1>");
};

export const updateUser = async (req, res, next) => {
  try { 

    if (req.user.id !== req.params.id) {
      return next(new AppError(`You can not update this user!✋`, 403));
    }
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new AppError("user does not exists", 400));
    }
    
    if (req.body.password) {
      if (req.body.password.length < 8) {
        return next( new AppError("password must be at least 6 character long!✋", 400))
      }
      user.password = req.body.password;
    }
    if (req.body.username) {
      if (req.body.username.length < 5 || req.body.username.length >20) {
        return next(new AppError("username must be between 5 and 20 characters✋", 400))
  
      }
      if (req.body.username.includes(" ")) {
        return next(new AppError("username can not contain spaces✋", 400))
      }
      if (req.body.username !== req.body.username.toLowerCase()) {
        return next(new AppError("username must be in lowercase✋", 400))
      }
      if (req.body.username.match(/^[a-aZ-Z0-9]+$/)) {
        return next(new AppError("username can only contain letters and numbers✋", 400))
      }
      user.username = req.body.username;
    }
    if (req.file) {
      if (user.avatar.public_id) {
        await cloudinary.v2.api
        .delete_resources([user.avatar.public_id], 
          { type: 'upload', resource_type: 'image' });
      }
        const result = await cloudinary.v2.uploader.upload(req.file.path, {
          folder: "Blog",
          width: 250,
          height: 250,
          gravity: "faces",
          crop: "fill",
        });
        if (result) {
          (user.avatar.public_id = result?.public_id),
            (user.avatar.secure_url = result?.secure_url),
            await fs.rm(`uploads/${req.file.filename}`);
        }
    }
    await user.save();
    user.password = undefined;
    return res.status(200).json({
      success: true,
      message: "user updated successfully",
      user,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

export const deleteUser = async(req,res,next)=>{
  if (req.user.id !== req.params.id) {
    return next(new AppError(`You can not update this user!✋`, 403));
  }
  try {
    await User.findByIdAndDelete(req.params.id)
    return res.status(200).json({
      success: true,
      message: "user delted successfully"
    });
    
  } catch (error) {
    return next(new AppError(error.message, 500));
    
  }
};

export const getusers = async(req,res,next)=>{
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort==='asc' ? 1:-1;
    const users = await User.find()
                .sort({createdAt:sortDirection})
                .skip(startIndex)
                .limit(limit).select('-password');

    const totalUsers = await User.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth()-1,
      now.getDate()
    );
    
    const lastMonthUsers = await User.countDocuments({
      createdAt:{$gte:oneMonthAgo}
    });

    res.status(200).json({
      users,
      totalUsers,
      lastMonthUsers
    })


  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

export const getuser = async(req,res,next)=>{
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(new AppError("User not found!🤨", 500));  
    }
    res.status(200).json({
      success:true,
      user
    })

  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};