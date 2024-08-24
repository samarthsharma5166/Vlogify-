import express from 'express'
import {isLoggedin} from '../middleware/jwtAuth.js'
import { create, deletePost, getPosts, updatePost } from '../controller/post.controller.js';
import upload from '../middleware/multer.middleware.js'
const router = express.Router();

router.post('/create',isLoggedin,upload.single("image"),create);
router.get('/getposts',getPosts);
router.delete('/delete/:id',isLoggedin,deletePost);
router.post('/update/:postId/:userId',isLoggedin,upload.single("image"),updatePost);

export default router;