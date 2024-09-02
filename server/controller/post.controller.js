import AppError from "../utils/error.utils.js";
import Blog from "../models/blog.model.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";
import mongoose from "mongoose";
import Comment from "../models/comment.model.js";
export const create = async (req, res, next) => {
  if (!req.body.title || !req.body.content) {
    return next(new AppError(`All fields are required! 😢`, 400));
  }
  const slug = req.body.title
    .split(" ")
    .join("")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "-");
  const blog = new Blog({
    title: req.body.title,
    content: req.body.content,
    category: req.body.category,
    slug,
    createdBy: req.user.id,
  });
  try {
    if (req.file) {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "Blog",
        width: 1600,
        height: 1200,
        gravity: "faces",
        crop: "auto",
      });
      if (result) {
        (blog.image.public_id = result?.public_id),
          (blog.image.secure_url = result?.secure_url),
          await fs.rm(`uploads/${req.file.filename}`);
      }
    }
    await blog.save();
    return res.status(200).json({
      success: true,
      message: "post created successully!🙌",
      blog,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

export const getPosts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortOrder = req.query.order === "asc" ? 1 : -1;
    const blogs = await Blog.find({
      ...(req.query.userId && { createdBy: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && {_id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or:[
            {title:{$regex:req.query.searchTerm,$options:'i'}},
            {content:{$regex:req.query.searchTerm,$options:'i'}}
      ],
      })
    }).sort({updatedAt:sortOrder}).skip(startIndex).limit(limit);
    const totalBlogs = await Blog.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
        now.getFullYear(),
        now.getMonth()-1,
        now.getDate(),
    );
    const lastMonthBlogs = await Blog.countDocuments({
        createdAt:{$gte:oneMonthAgo}
    });

    res.status(200).json({
        blogs,
        totalBlogs,
        lastMonthBlogs
    })
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

export const deletePost = async(req,res,next) =>{
  const id = req.params.id;
  try {
    const blog = await Blog.findById(id).populate('createdBy');
    const comments = await Comment.find({blogId:id});
    if(req.user.id !== blog.createdBy._id.toString()){
      return next(new AppError(`you do not have permission to delete this post 😢`, 400));
    }
    if (blog.image.public_id) {
      await cloudinary.v2.api
      .delete_resources([blog.image.public_id], 
        { type: 'upload', resource_type: 'image' });
    }
    await blog.deleteOne();
    if(comments.length>0){
      await Comment.deleteMany({blogId:id});
    }
    return res.json({
      success:true,
      message:"deleted successfully!",
    }) 
  } catch (error) {
    return next(new AppError(error.message, 500));
    
  }
}

export const updatePost = async(req,res,next)=>{
  const {postId,userId} = req.params;
 try {
   const blog = await Blog.findById(postId);
  if(req.user.id!== userId){
    return next(new AppError(`you do not have permission to delete this post 😢`, 400));
  }


  if(req.body.title){
    blog.title = req.body.title;
    blog.slug = req.body.title
    .split(" ")
    .join("")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "-");
  }
  if(req.body.content){
    blog.content = req.body.content;
  }
  if(req.body.category){
    blog.category = req.body.category;
  }
  if(req.file){
    try {
      if(blog.image.public_id){
        await cloudinary.v2.api.delete_resources([blog.image.public_id],
          { type: 'upload', resource_type: 'image' }
        );
      }
      const result = await cloudinary.v2.uploader.upload(req.file.path,{
        folder:"Blog",
        width:1200,
        height:1200,
        gravity: "faces",
        crop: "auto",
      });
      if (result) {
        blog.image.public_id = result.public_id;
          blog.image.secure_url = result.secure_url;
          // await fs.rm(`uploads/${req.file.filename}`);
      }
    } catch (error) {
    return next(new AppError(error.message, 500)); 
    }
  }
  await blog.save();
    return res.status(200).json({
      success: true,
      message: "updated successully!🙌",
      blog,
    });
 } catch (error) {
  return next(new AppError(error.message, 500));
 }

}