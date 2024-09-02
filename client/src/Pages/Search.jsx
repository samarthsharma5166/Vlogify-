import React, { useEffect, useState } from "react";
import { Button, Select, TextInput } from "flowbite-react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../Helper/axiosInstance.js";
import Blogcard from "../Components/Blogcard.jsx";
import toast from "react-hot-toast";
const category = [
  "TECHNOLOGY",
  "HEALTH AND FITNESS",
  "TRAVEL",
  "FOOD AND DRINK",
  "LIFESTYLE",
  "FINANCE",
  "EDUCATION",
  "ENTERTAINMENT",
  "BUSINESS",
  "ENVIRONMENT",
  "DIY AND CRAFTS",
  "PARENTING",
  "SPORTS",
  "AUTOMOTIVE",
  "SCIENCE",
  "POLITICS",
];
const Search = () => {
  const navigate = useNavigate();
  const [sideBar, setSideBar] = useState({
    searchTerm: "",
    sort: "desc",
    category: "uncategorized",
  });
  const [posts, setPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const location = useLocation();
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const sortFromUrl = urlParams.get("sort");
    const categoryFromUrl = urlParams.get("category");
    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSideBar({
        ...sideBar,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl,
      });
    }
    
    async function fetchPosts() {
      try {
        const searchQuery = urlParams.toString();
        const res = await axiosInstance.get(`api/post/getposts?${searchQuery}`);
        if (res?.data) {
          const blogs = res.data.blogs;
          setPosts(blogs);
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
    fetchPosts();
  }, [location.search]);

  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSideBar({
        ...sideBar,
        searchTerm: e.target.value,
      });
    }
    if (e.target.id === "sort") {
      const order = e.target.value || "desc";
      setSideBar({
        ...sideBar,
        sort: order,
      });
    }
    if (e.target.id === "category") {
      const category = e.target.value || "UNCATEGORISED";
      setSideBar({
        ...sideBar,
        category: category,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", sideBar.searchTerm);
    urlParams.set("sort", sideBar.sort);
    urlParams.set("category", sideBar.category);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  const handleShowMore = async() => {
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
  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <TextInput
              placeholder="Search..."
              id="searchTerm"
              type="text"
              value={sideBar.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold ">Sort:</label>
            <Select
              id="sort"
              value={sideBar.sort}
              onChange={handleChange}
            >
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold ">Category:</label>
            <Select
              id="category"
              value={sideBar.category}
              onChange={handleChange}
            >
              <option value="UNCATEGORISED" id="category">
                Select
              </option>
              {category.map((cat, idx) => (
                <option key={idx} value={cat} id="category">
                  {cat}
                </option>
              ))}
            </Select>
          </div>
          <Button gradientDuoTone="purpleToPink" type="submit" outline>Apply Filters</Button>
        </form>
      </div>
      <div className="w-full">
        <h1 className="text-3xl font-semibold sm:border-b sm:border-gray-500 p-5">Posts Results</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-7 p-5">
            {
              
              posts.length > 0 ? posts.map((post) => <Blogcard key={post._id} blog={post} />) : <p className="text-xl text-gray-500">No posts found</p>
            }
            
        </div>
        {
              showMore && <button className="text-teal-500 text-lg hover:underline text-center w-full m-4" onClick={handleShowMore}>Load More</button>
            }
      </div>
    </div>
  );
};

export default Search;
