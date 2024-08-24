import mongoose from 'mongoose';
const commentSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true
    },
    blogId:{
        type:mongoose.Schema.ObjectId,
        ref:'Blog'
    },
    userId:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    },
    likes:{
        type:Array,
        default:[]
    },
    numberOfLikes:{
        type:Number,
        default:0
    }
},{timestamps:true});

const Comment = mongoose.model("Comment",commentSchema);
export default Comment;