import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteBlog, getMorePosts, getUserPosts } from "../../redux/Blog/blogSlice";
import toast from "react-hot-toast";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Table, Modal, Button } from "flowbite-react";
import { Link, Navigate } from "react-router-dom";
const Dashposts = () => {
  const data = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [userBlog, setUserBlog] = useState([]);
  const [showModel, setShowModel] = useState(false);
  const [showMore,setShowMore] = useState(true);
  const [blogId, setBlogId] = useState();
  const [reload, setReload] = useState(false);
  const getUserBlog = async () => {
    try {
      const res = await dispatch(getUserPosts());
      if (res?.payload) {
        setUserBlog(res.payload.blogs);
        if (res.payload.blogs.length < 9) {
          setShowMore(false);
        }else{
          setShowMore(true)
        } 
      } 
    } catch (error) {
      toast(error?.response?.data?.message);
    }
  };
  useEffect(() => {
    getUserBlog();
  }, [data.user._id,reload]);

  const handleDelete = async (id) => {
    setBlogId(id); // Highlighted: Set the blog to be deleted
    setShowModel(true);
  };

  const confirmDelete = async () => {
    setShowModel(false); 
    try {
      const res = await dispatch(deleteBlog(blogId));
      console.log(res)
      if (res?.payload?.success) {
        setReload(!reload);
      }
      // Highlighted: Close the modal
      setBlogId(null); // Highlighted: Reset the blogToDelete state
    } catch (error) {
      setBlogId(null);
      console.log(error)
      toast(error?.response?.data?.data);
    }
  };

  async function handleShowMore(){
    console.log(1)
    try {
      const res = await dispatch(getMorePosts(userBlog.length));
      if (res?.payload) {
        setUserBlog((prev)=>[...prev,res.payload.blogs])
        if (res.payload.blogs.length < 9)
          setShowMore(false);
      } 
    } catch (error) {
      console.log(error);
      toast(error?.response?.data?.message);
    }
  }

  return (
    <div className="table-auto overflow-x-auto md:mx-auto px-3 scrollbar scrollbar-track-slate-500 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {data.isLoggedIn === true && userBlog.length > 0 ? (
        <>
        <Table hoverable className="shadow-md">
          <Table.Head>
            <Table.HeadCell>date updated</Table.HeadCell>
            <Table.HeadCell>post image</Table.HeadCell>
            <Table.HeadCell>post title</Table.HeadCell>
            <Table.HeadCell>categroy</Table.HeadCell>
            <Table.HeadCell>date upload</Table.HeadCell>
            <Table.HeadCell>Delete</Table.HeadCell>
            <Table.HeadCell>
              <span>Edit</span>
            </Table.HeadCell>
          </Table.Head>

          {userBlog.map((blog) => (
            <Table.Body className="divide-y" key={blog._id}>
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>
                  {new Date(blog.updatedAt).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                  <Link to={`/post/${blog.slug}`}>
                    <img
                      src={blog?.image?.secure_url}
                      alt="404 not found"
                      className="w-20 h-20 object-cover bg-gray-500"
                    />
                  </Link>
                </Table.Cell>
                <Table.Cell>
                  <Link
                    to={`/post/${blog.slug}`}
                    className="font-medium text-gray-900 dark:text-white"
                  >
                    {blog.title}
                  </Link>
                </Table.Cell>
                <Table.Cell>{blog.category}</Table.Cell>
                <Table.Cell>
                  {new Date(blog.createdAt).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                  <span
                    className="font-medium text-red-500 cursor-pointer hover:underline"
                    onClick={() => handleDelete(blog._id)}
                  >
                    Delete
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <Link to={`/update-post/${blog._id}`}>
                    <span className="text-teal-500 cursor-pointer hover:underline">
                      Edit
                    </span>
                  </Link>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          ))}
        </Table>
        {
          showMore && <button className="w-full text-teal-500 self-center text-sm py-7" onClick={()=>handleShowMore()}>show more</button>
        }
        </>
      ) : (
        <p className="text-center font-semibold mt-5"> You have no blogs yet!</p>
      )}

      <Modal
        show={showModel}
        onClose={() => setShowModel(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-green-500 dark:text-gray-400">
              Are you sure you want to delete you account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={confirmDelete}>
                Yes, I'm
              </Button>
              <Button color="gray" onClick={() => setShowModel(false)}>
                No
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Dashposts;
