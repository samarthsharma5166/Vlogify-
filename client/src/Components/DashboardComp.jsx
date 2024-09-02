import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getdashusers } from "../redux/user/userSlice";
import { Link, useNavigate } from "react-router-dom";
import { userdashComment } from "../redux/Comment/commentSlice";
import { getUserPosts } from "../redux/Blog/blogSlice";
import { HiOutlineUserGroup, HiArrowNarrowUp, HiAnnotation, HiDocumentText } from "react-icons/hi";
import toast from "react-hot-toast";
import  { Button,ButtonGroup, Table, TableBody } from 'flowbite-react';

const DashboardComp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [totaluser, setTotaluser] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);
  const {  isLoggedIn } = useSelector((state) => state.user);

  useEffect(() => {
    try {
      const fetchUsers = async () => {
        const res = await dispatch(getdashusers(5));
        if (res?.payload) {
          const users = res.payload.users;
          setUsers([...users]);
          setTotaluser(res.payload.totalUsers);
          setLastMonthUsers(res.payload.lastMonthUsers);
        }
      };
      const fetchPosts = async () => {
        try {
          const res = await dispatch(getUserPosts(5));
          if (res?.payload) {
            setBlogs(res.payload.blogs);
            setTotalPosts(res.payload.totalBlogs);
            setLastMonthPosts(res.payload.lastMonthBlogs);
          }
        } catch (error) {
          toast.error(error?.response?.data?.message);
        }
      };
      const fetchComments = async () => {
        try {
          const res = await dispatch(userdashComment(5));
          if (res?.payload?.success) {
            setComments(res.payload.comments);
            setTotalComments(res.payload.comments.length);
            setLastMonthComments(res.payload.lastMonthComments);
          }
        } catch (error) {
          toast.error(error?.response?.data?.message);
        }
      };
      if (isLoggedIn) {
        fetchUsers();
        fetchPosts();
        fetchComments();
      } else {
        navigate("/sign-in");
      }
    } catch (error) {
      toast(error?.response?.data?.message);
    }
  }, []);
  return (
    <div className="p-3 md:mx-auto w-full ">
      <div className="flex-wrap flex gap-4 justify-center w-full">
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div>
              <h3 className="text-gray-500 font-medium uppercase">
                Total Users
              </h3>
              <p className="text-2xl ">{totaluser}</p>
            </div>
            <HiOutlineUserGroup className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="flex items-center text-green-500">
              <HiArrowNarrowUp />
              {lastMonthUsers}
            </span>
            <div className="text-gray-500">Last month</div>
          </div>
        </div>
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div>
              <h3 className="text-gray-500 font-medium uppercase">
                Total Comments
              </h3>
              <p className="text-2xl ">{totalComments}</p>
            </div>
            <HiAnnotation className="bg-indigo-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="flex items-center text-green-500">
              <HiArrowNarrowUp />
              {lastMonthComments}
            </span>
            <div className="text-gray-500">Last month</div>
          </div>
        </div>
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div>
              <h3 className="text-gray-500 font-medium uppercase">
                Total blogs
              </h3>
              <p className="text-2xl ">{blogs.length}</p>
            </div>
            <HiDocumentText className="bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="flex items-center text-green-500">
              <HiArrowNarrowUp />
              {lastMonthPosts}
            </span>
            <div className="text-gray-500">Last month</div>
          </div>
        </div>
      </div>
      <div className="flex mx-auto flex-wrap gap-4 py-3 justify-center md:w-[46.875vw] w-full">
          <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
            <div className="flex justify-between p-3 text-sm font-semibold ">
              <h1 className="text-center p-2">Recent users</h1>
              <Link to='/dashboard?tab=users'>
                <Button gradientDuoTone="purpleToPink" outline>View All</Button>
              </Link>
            </div>
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>
                    user image
                </Table.HeadCell>
                <Table.HeadCell>
                    username
                </Table.HeadCell>
              </Table.Head>
              {
                users && users.map((user)=>{
                  return <Table.Body>
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell>
                        {(user.avatar.secure_url !== "")?(<img src={user.avatar.secure_url} className="w-10 h-10 rounded-full"/>):(<div className="w-10 h-10 bg-gray-500 rounded-full"/>)}
                      </Table.Cell>
                      <Table.Cell>
                        {user.username}
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                })
              }
            </Table>
          </div>
          <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
            <div className="flex justify-between p-3 text-sm font-semibold ">
              <h1 className="text-center p-2">Recent comments</h1>
              <Link to='/dashboard?tab=comments'>
                <Button gradientDuoTone="purpleToPink" outline>View All</Button>
              </Link>
            </div>
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>
                   comment content
                </Table.HeadCell>
                <Table.HeadCell>
                    comment likes
                </Table.HeadCell>
              </Table.Head>
              {
                comments && comments.map((comment)=>{
                return <Table.Body key={comment._id}>
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell className="w-96">
                        <p className="line-clamp-2">{comment.content}</p>
                      </Table.Cell>
                      <Table.Cell className="text-center">
                        {comment.numberOfLikes}
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                })
              }
            </Table>
          </div>
          <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800 overflow-y-auto">
            <div className="flex justify-between p-3 text-sm font-semibold ">
              <h1 className="text-center p-2">Recent blogs</h1>
              <Link to='/dashboard?tab=posts'>
                <Button gradientDuoTone="purpleToPink" outline>View All</Button>
              </Link>
            </div>
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell>
                    blog image
                </Table.HeadCell>
                <Table.HeadCell>
                    blog title
                </Table.HeadCell>
                <Table.HeadCell>
                    blog category
                </Table.HeadCell>
              </Table.Head>
              {
                blogs && blogs.map((blog)=>{
                  return <Table.Body key={blog._id}>
                    <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                      <Table.Cell>
                        {(blog.image.secure_url !== "")?(<img src={blog.image.secure_url} className="w-14 h-10 rounded-md"/>):(<div className="w-10 h-10 bg-gray-500 rounded-full"/>)}
                      </Table.Cell>
                      <Table.Cell>
                        <p className="w-96 line-clamp-2 ">{blog.title}</p>
                      </Table.Cell>
                      <Table.Cell>
                        <p className="w-5">{blog.category}</p>
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                })
              }
            </Table>
          </div>
      </div>
    </div>
  );
};

export default DashboardComp;
