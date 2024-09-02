import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getBlogBySlug } from "../redux/Blog/blogSlice";
import toast from "react-hot-toast";
import { Button } from "flowbite-react";
import CallToAction from "../Components/CallToAction";
import CommentSection from "../Components/CommentSection";
import axiosInstance from "../Helper/axiosInstance";
import Blogcard from "../Components/Blogcard";
const Postpage = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const [blogData, setBlogData] = useState({});
  const [blogImage, setBlogImage] = useState();
  const [recentPost,setRecentPost] = useState(null);
  async function getBlog() {
    try {
      const res = await dispatch(getBlogBySlug(slug));
      if (res.payload.blogs) {
        const blog = res.payload.blogs[0];
        setBlogImage(blog.image.secure_url);
        setBlogData(blog);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      return;
    }
  }
  useEffect(() => {
    setBlogData({});
    getBlog();
  }, [slug]);
   

  async function getRecentPost(){
    try {
      const res = await axiosInstance.get(`api/post/getposts?limit=3`);
      if (res?.data?.blogs) {
        const blogs = res.data.blogs;
        setRecentPost(blogs);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      return;
    }
  }

  useEffect(() => {
    getRecentPost();
  }, []);
  return (
    <main className="p-3 mx-auto flex flex-col max-w-6xl min-h-screen">
      <h1 className="text-3xl text-center max-w-2xl mx-auto font-serif mt-10 p-3">
        {blogData.title}
      </h1>
      <Link to={`/search?category=${blogData && blogData.category}`}>
        <Button
          color="grey"
          pill
          size="xs"
          className="mx-auto tracking-widest mt-5"
        >
          {blogData && blogData.category}
        </Button>
      </Link>
      <img
        src={blogData.image && blogImage}
        alt="Not found 404!😢"
        className="mt-10 p-3 max-h-[600px] w-full object-fill rounded-lg"
      />
      <div className="flex justify-between p-3 border-b border-slate-500 text-xs">
        <span>{blogData && new Date(blogData.createdAt).toLocaleDateString()}</span>
        <span>{blogData.content && ((blogData.content.length)/1000).toFixed(0)}min read</span>
      </div>

      <div className="p-3 max-w-2xl mx-auto w-full post-content" dangerouslySetInnerHTML={{__html:blogData && blogData.content}}>
      </div>
      <div className="max-w-4xl mx-auto w-full">
        <CallToAction/>
      </div>
      <CommentSection blogId={blogData._id}/>
      <div className="flex flex-col justify-center items-center mb-5">
        <h1 className="text-xl mt-5 ">Recent Articles</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 juccent-center mt-5">
          {recentPost && recentPost.map((blog) =><Blogcard key={blog._id} blog={blog}/>)}
        </div>
      </div>
    </main>
  );
};

export default Postpage;
