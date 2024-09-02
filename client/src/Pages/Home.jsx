import React, { useEffect, useRef, useState } from "react";
import homevib from '../assets/Homevib.mp4';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CallToAction from "../Components/CallToAction";
import axiosInstance from "../Helper/axiosInstance";
import toast from "react-hot-toast";
import Blogcard from "../Components/Blogcard";
import { Link } from "react-router-dom";

const Home = () => {
  const mainContainer = useRef();
  const topContainer = useRef();
  const bottomContainer = useRef();
  const img = useRef();
  const[blogs,setBlogs]=useState([]);
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axiosInstance.get("api/post/getposts");
        if (res?.data) {
          const blogs = res.data.blogs;
          setBlogs(blogs);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message);
      }
    };

    fetchPosts();
  }, []);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: mainContainer.current,
        start: "50% 50%",
        end: "150% 150%",
        scrub: true,
        pin: true,
      },
    });

    tl.to(topContainer.current, {
      rotateX: "110deg",
      opacity: 0,
      duration: 1.5,
      ease: "Power1.easeOut",
    }, "sm");

    tl.to(bottomContainer.current, {
      rotateX: "-110deg",
      opacity: 0,
      duration: 1.5,
    }, "sm");

    tl.to(img.current, {
      height: "100vh",
      width: "100vw",
      duration: 5,
    }, "sm");

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <>
      <main className="w-screen h-screen overflow-hidden bg-gradient-to-r from-[#00c6ff] to-[#0072ff]">
      <div className="relative w-full h-screen flex items-center justify-center flex-col" ref={mainContainer}>
        <div className="top__container text-center absolute  md:top-[8vw] " >
          <div className="top__container-box1 transition-all duration-500 flex flex-col items-center" ref={topContainer}>
            <h1 className="text-5xl text-white  mb-4 md:text-6xl tracking-wide font-medium ">Welcome to Vlogify!</h1>
            <p className="w-[50vw] text-sm md:text-xl font-light mb-[5%] mt-[2%] text-center text-white">
              Discover insightful articles, explore creative ideas, and dive deep into the world of technology, lifestyle, and more. Our blog is your go-to resource for inspiration and knowledge.
            </p>
          </div>
        </div>
        <div className="h-[50%] w-[65vw] bg-cover bg-center transition-all duration-700" ref={img}>
          <video
            src={homevib}
            autoPlay
            loop
            muted
            className="w-full h-full object-cover bg-cover bg-center"
          ></video>
        </div>
        <div className="bottom__container text-center absolute bottom-[15%] hidden md:block" >
          <div className="bottom__containert-box1 text-center flex items-center flex-col transition-all duration-500" ref={bottomContainer}>
            <h1 className="text-3xl md:text-6xl font-light text-white">Why Follow Our Blog?</h1>
            <p className="w-[50vw] tracking-wide text-white font-normal text-sm md:text-xl mt-3 dark:text-white">
              Join a community of curious minds and stay updated with the latest trends and insights. Our content is carefully curated to provide you with the most relevant and interesting topics in today's fast-paced world.
            </p>
          </div>
        </div>
      </div>
    </main>
    
    <div className="p-3 bg-amber-100 dark:bg-slate-700">
      <CallToAction/>
    </div>
    
    <div className="max-w-6xl  mx-auto p-3 flex flex-col gap-8 py-7 ">
      {
        
        blogs && blogs.length > 0  && (
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-semibold text-center">Recent Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {
                blogs.map(blog => (
                  <Blogcard key={blog._id} blog={blog}/>
                ))
              }
            </div>
            <Link to={'/blogs'} className="text-lg text-teal-500 hover:underline text-center">
              View all posts
            </Link>
          </div>
        )
      }
    </div>
    </>
  );
};

export default Home;
