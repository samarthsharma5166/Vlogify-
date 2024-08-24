import express from 'express';
import { deleteUser, getuser, getusers, test, updateUser } from '../controller/user.controller.js';
import { isLoggedin } from '../middleware/jwtAuth.js';
import upload from '../middleware/multer.middleware.js'
const router = express.Router();

router.get('/',test);
router.put('/update/:id',isLoggedin,upload.single('avatar'),updateUser);
router.delete('/delete/:id',isLoggedin,deleteUser);
router.get('/getusers',isLoggedin,getusers);
router.get('/:userId',getuser);

export default router
