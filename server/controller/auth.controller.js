import User from "../models/user.model.js";
import AppError from "../utils/error.utils.js";
const cookieOption = {
  httpOnly: true,
  secure: 'production',
  maxAge: 1000 * 60 * 60 * 24,
  sameSite: 'none',
};
export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return next(new AppError(`All fields are required! 😢`, 400));
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new AppError(`email already exists 🤷‍♂️`, 400));
    }
    const user = await User.create({
      username,
      email,
      password,
      avatar:{
        public_id:"",
        secure_url:"" 
    }
    });
    if (!user) {
      return next(new AppError(`something went wrong please try again!`, 400));
    }
    await user.save();
    user.password = undefined;
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    return next(new AppError(error.message, 400));
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError(`All fields are required! 😢`, 400));
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new AppError(`User not found! 😴`, 404));
    }
    if (!(await user.comparePassword(password))) {
      return next(new AppError(`Invalid password! 😒`, 401));
    }
    const token = await user.jwtToken();
    user.password = undefined;
    res.cookie("token", token, cookieOption);
    return res.status(200).json({
      success: true,
      message: "User login successfully! 🎉",
      user,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

export const getuser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    return res.status(200).json({
      success: true,
      message: "User login successfully! 🎉",
      user,
    });
  } catch (error) {
    return next(new AppError(error.message,500));
  }
};

export const logout = (req,res,next)=>{
  try {
    res.cookie("token",null,{
      secure:true,
      maxAge:0,
      httpOnly:true
    })
    res.status(200).json({
      success:true,
      message:'logout successfully! 😴'
    })
  } catch (error) {
    return next(new AppError(error.message,500));
  }
};
