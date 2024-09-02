import React, { useEffect, useState } from 'react'
import BlogCard2 from '../Components/BlogCard2'
import axiosInstance from '../Helper/axiosInstance';
import toast from 'react-hot-toast';
const Projects = () => {
  const [posts,setPosts] = useState([]);
  const [showMore,setShowMore] = useState(false);

  const fetchPost = async()=>{
    try{
      const res = await axiosInstance.get("api/post/getposts");
      if(res?.data){
        setPosts(res.data.blogs);
        if(res.data.blogs.length === 9){
          setShowMore(true);
        }else{
          setShowMore(false);
        }
      }
    }catch(err){
      toast.error(err?.response?.data?.message);
    }
  }
  const handleShowMore = async()=>{
    try {
      const numberOfPosts = posts.length;
      const urlParams = new URLSearchParams(location.search);
      urlParams.set('startIndex', numberOfPosts);
      const searchQuery = urlParams.toString();
      const res = await axiosInstance.get(`api/post/getposts?${searchQuery}`);
      if (res?.data) {
        const blogs = res.data.blogs;
        setPosts((prev) => [...prev, ...blogs]);
        if (res.data.blogs.length === 9) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
  useEffect(()=>{
    fetchPost();
  },[])
  return (
    <div>
      <h1 className='text-3xl font-bold tracking-wider text-center p-4 border-b-2 border-gray-500'>Blogs</h1>
      <div className='mx-auto flex flex-wrap justify-center'>
        {posts.map((blog)=>(<BlogCard2 key={blog._id} blog={blog}/>))}
      </div>
      <div className='flex justify-center'>
        {showMore && <button className='p-3 text-center text-gray-500' onClick={handleShowMore}>Show More</button>}
      </div>      
    </div>
  )
}

export default Projects
