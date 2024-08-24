import mongoose, { Schema } from "mongoose";

const postSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    image:{
        public_id:{
            type:String,
        },
        secure_url:{
            type:String,
            default:"https://media.istockphoto.com/id/1395313484/vector/blog-on-grey-background-concept-logo-blog-with-letter-o-in-the-form-ring-light-or-rgb-circle.jpg?s=612x612&w=0&k=20&c=q6KgR6PIxjTWZiTctmewl_IdB9UyYd60CRiarTf2vwQ="
        } 
    },
    category:{
        type:String,
        enum:["UNCATEGORISED","TECHNOLOGY","HEALTH AND FITNESS","TRAVEL","FOOD AND DRINK","LIFESTYLE","FINANCE","EDUCATION","ENTERTAINMENT","BUSINESS","ENVIRONMENT","DIY AND CRAFTS","PARENTING","SPORTS","AUTOMOTIVE","SCIENCE","POLITICS"],
        default:"UNCATEGORISED"
    },
    slug:{
        type:String,
        required:true,
        unique:true
    },
    createdBy:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    comments:{
        type:Schema.Types.ObjectId,
        ref:'Comment'
    }
},{timestamps:true})

const Blog = mongoose.model("Blog",postSchema);
export default Blog;
