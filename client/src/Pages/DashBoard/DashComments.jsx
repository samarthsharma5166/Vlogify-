import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteBlog, getMorePosts, getUserPosts } from "../../redux/Blog/blogSlice";
import toast from "react-hot-toast";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Table, Modal, Button } from "flowbite-react";
import { Link, Navigate } from "react-router-dom";
import { getusers } from "../../redux/user/userSlice.js";
import { userComment } from "../../redux/Comment/commentSlice.js";
const DashComments = () => {
  const data = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [comments, setComments] = useState([]);
  const [showMore,setShowMore] = useState(true);
  const [reload, setReload] = useState(false);
  const getUsers = async () => {
    try {
      const res = await dispatch(userComment());
      if (res?.payload?.success) {
        const comments = res.payload.comments
        setComments(comments);
        if (res.payload.users.length < 9) {
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
    getUsers();
  }, [data.user._id,reload]);

  async function handleShowMore(){
    try {
      const startIndex = users.length
      const res = await dispatch(getusers(startIndex));
      if (res?.payload.users) {
        const users1 = res.payload.users
        setUsers((prev)=>[...prev,...users1])
        if (res.payload.users.length < 9)
          setShowMore(false);
      } 
    } catch (error) {
      toast(error?.response?.data?.message);
    }
  }

  return (
    <div className="table-auto overflow-x-auto md:mx-auto px-3 scrollbar scrollbar-track-slate-500 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {data.isLoggedIn === true && comments.length > 0 ? (
        <>
        <Table hoverable className="shadow-md">
          <Table.Head>
            <Table.HeadCell>date updated</Table.HeadCell>
            <Table.HeadCell>comment content</Table.HeadCell>
            <Table.HeadCell>number of likes</Table.HeadCell>
            <Table.HeadCell>post image</Table.HeadCell>
            <Table.HeadCell>post id</Table.HeadCell>
            <Table.HeadCell>user</Table.HeadCell>
          </Table.Head>
          {comments.map((comment) => (
            <Table.Body className="divide-y" key={comment._id}>
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>
                  {new Date(comment.createdAt).toLocaleDateString()}
                </Table.Cell>
                <Table.Cell>
                  <Link to={`/post/${comment?.blogId?.slug}`}>
                    <p>{comment.content}</p>
                  </Link>
                </Table.Cell>
                <Table.Cell>
                  <Link
                    className="font-medium text-gray-900 dark:text-white"
                  >
                    {comment.numberOfLikes}
                  </Link>
                </Table.Cell>
                <Table.Cell>
                  <Link
                    to={`/post/${comment?.blogId?.slug}`}
                  >
                    <img src={comment?.blogId?.image.secure_url} alt="post image" className="w-20 rounded-lg"/>
                  </Link>
                </Table.Cell>
                <Table.Cell>
                  <Link
                    to={`/post/${comment?.blogId?.slug  }`}
                    className="font-medium text-gray-900 dark:text-white"
                  >
                    {comment?.blogId?._id}
                  </Link>
                </Table.Cell>
                <Table.Cell>
                  <Link
                    to={`/post/${comment?.blogId?.slug}`}
                    className="font-medium text-gray-900 dark:text-white"
                  >
                    {comment?.userId}
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
        <p className="text-center font-semibold mt-5"> You have no comments yet!</p>
      )}

      {/* <Modal
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
      </Modal> */}
    </div>
  );
};

export default DashComments;
