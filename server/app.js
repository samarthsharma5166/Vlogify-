import express from 'express';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import postRouter from './routes/post.route.js';
import commentRouter from './routes/comment.route.js';
import errorMiddleware from './middleware/errorMiddleware.js';
import cookieParser from 'cookie-parser'
import cors from 'cors'
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
  }));

  
app.use('/api/user',userRouter)
app.use('/api/auth',authRouter)
app.use('/api/post',postRouter)
app.use('/api/comment',commentRouter)


app.use(errorMiddleware);
export default app;
