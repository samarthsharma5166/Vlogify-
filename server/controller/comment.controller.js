import Comment from "../models/comment.model.js";
import AppError from "../utils/error.utils.js";

export const createComment = async (req, res, next) => {
  try {
    const { content, blogId, userId } = req.body;
    if (req.user.id !== userId) {
      return next(new AppError("you not allowed to create comment! ✋", 403));
    }
    const newComment = new Comment({
      content,
      blogId,
      userId,
    });
    await newComment.save();
    res.status(200).json({
      success: true,
      message: "👍",
      newComment,
    });
  } catch (error) {
    return next(new AppError(error, 500));
  }
};

export const getCommentById = async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const comments = await Comment.find({ blogId: postId }).sort({
      createdAt: -1,
    });
    return res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    return next(new AppError(error, 500));
  }
};

export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(new AppError("No comment found!✋", 403));
    }
    const userIndex = comment.likes.indexOf(req.user.id);
    if (userIndex === -1) {
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.id);
    } else {
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
    }
    await comment.save();
    res.status(200).json({
      success: true,
      comment,
    });
  } catch (error) {
    return next(new AppError(error, 500));
  }
};

export const editComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(new AppError("No comment found!✋", 403));
    }
    if (req.user.id !== comment.userId.toString()) {
      return next(new AppError("You can not update this comment!✋", 403));
    }
    comment.content = req.body.content;
    await comment.save();
    res.status(200).json({
      success: true,
      comment,
    });
  } catch (error) {
    return next(new AppError(error, 500));
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      return next(new AppError("No comment found!✋", 403));
    }
    if (req.user.id !== comment.userId.toString()) {
      return next(new AppError("You can not delete this comment!✋", 403));
    }
    await comment.deleteOne();
    res.status(200).json({
      success: true,
      message: "deleted successfully!",
    });
  } catch (error) {
    console.log(error);
    return next(new AppError(error, 500));
  }
};

export const getUserComment = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "asc" ? 1 : -1;
    const comments = await Comment.find({ userId: req.user.id })
    .populate("blogId")
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);
      const now = new Date();
    const oneMonthAgo = new Date( 
      now.getFullYear(),
      now.getMonth()-1,
      now.getDate(),
    );
    const lastMonthComments = await Comment.countDocuments({
      createdAt: { $gte: oneMonthAgo },
      userId: req.user.id,
    });
    return res.status(200).json({
      success: true,
      comments,
      lastMonthComments
    });
  } catch (error) {
    return next(new AppError(error, 500));
  }
};
