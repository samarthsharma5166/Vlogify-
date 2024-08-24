import express from 'express'
import {isLoggedin} from '../middleware/jwtAuth.js'
import { createComment, deleteComment, editComment, getCommentById, getUserComment, likeComment } from '../controller/comment.controller.js';
const router = express.Router();

router.post('/create',isLoggedin,createComment);
router.get('/getPostById/:postId',getCommentById);
router.put('/likeComment/:commentId',isLoggedin,likeComment);
router.put('/editComment/:commentId',isLoggedin,editComment);
router.delete('/deleteComment/:commentId',isLoggedin,deleteComment);
router.get('/getUserComment',isLoggedin,getUserComment);

export default router