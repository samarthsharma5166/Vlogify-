import express from 'express';
import { getuser, login, logout, signup } from '../controller/auth.controller.js';
import { isLoggedin } from '../middleware/jwtAuth.js';
const router = express.Router();

router.post('/signup',signup);
router.post('/login',login);
router.get('/user',isLoggedin,getuser);
router.get('/logout',isLoggedin,logout);

export default router;