import { Button, Modal, Textarea } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  createComment,
  deleteComment,
  getCommentsById,
} from "../redux/Comment/commentSlice.js";
import toast from "react-hot-toast";
import Comment from "./Comment.jsx";
import axiosInstance from "../Helper/axiosInstance.js";
import { HiOutlineExclamationCircle } from "react-icons/hi";

const CommentSection = ({ blogId }) => {
  const { isLoggedIn, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [comment, setComment] = useState("");
  const [showModal,setShowModal] = useState(false);
  const [commentToDelete,setCommentToDelete] = useState(null);
  const [comments, setComments] = useState([]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (comment.length === 0 || comment.length > 200) {
      return;
    }
    try {
      const res = await dispatch(createComment({ content: comment, blogId }));
      if (res.payload.success) {
        setComment("");
        setComments([res.payload.newComment, ...comments]);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      return;
    }
  };
  const getComments = async (e) => {
    if (blogId !== undefined) {
      try {
        const res = await dispatch(getCommentsById(blogId));
        if (res.payload.success) {
          const comments = res.payload.comments;
          setComments(comments);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message);
      }
    }
  };
  const handleDelete =async(commentId)=>{
    try {
      const res = await dispatch(deleteComment(commentId));
      if(res?.payload?.success){
        setComments(
          comments.filter((comment) => comment._id !== commentId)
        );
        setShowModal(false);
      }
      
    } catch (error) {
      toast.error(error?.response?.data?.message);
      return;
    }
  }
  useEffect(() => {
    getComments();
  }, [blogId]);

  const handleLike = async (commentId) => {
    try {
      if (!isLoggedIn) {
        navigate("/sign-in");
        return;
      }
      const res = await axiosInstance.put(
        `api/comment/likeComment/${commentId}`
      );
      if (res.data.success) {
        setComments(
          comments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: res.data.comment.likes,
                  numberOfLikes: res.data.comment.likes.length,
                }
              : comment
          )
        );
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const handleEdit = async (comment, editedContent) => {
    setComments(
      comments.map((c) =>
        c._id === comment._id ? { ...c, content: editedContent } : c
      )
    );
  };
  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {isLoggedIn ? (
        <div className="flex items-center gap-1 my-5 text-gray text-sm">
          <p>Signed in as: </p>
          <img
            src={user.avatar.secure_url}
            alt="user profile"
            className="h-5 w-5 object-cover rounded-full"
          />
          <Link
            to={"/dashboard?tab=profile"}
            className="text-xs text-cyan-600 hover:underline"
          >
            @{user.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-teal-500 my-5 flex gap-1">
          You must be signed in to comment.
          <Link to={"/sign-in"} className="text-blue-500 hover:underline">
            &nbsp; Sign In
          </Link>
        </div>
      )}
      {isLoggedIn && (
        <form
          className="border border-teal-300 rounded-md p-3"
          onSubmit={handleSubmit}
        >
          <Textarea
            placeholder="Add a comment..."
            rows={3}
            maxLength={200}
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500 text-xs cursor-default">
              {200 - comment.length} word remaining
            </p>
            <Button outline gradientDuoTone="purpleToBlue" type="submit">
              Comment
            </Button>
          </div>
        </form>
      )}
      {comments.length === 0 ? (
        <p className="text-sm my-5">No comments yet!</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-1">
            <p>Comments</p>
            <div className="border border-gray-400 py-1 px-2 rounded-sm">
              <p>{comments.length}</p>
            </div>
          </div>
          {comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onLike={handleLike}
              onEdit={handleEdit}
              onDelete={(commentId)=>{
                setShowModal(true);
                setCommentToDelete(commentId);
              }}
            />
          ))}
        </>
      )}
      
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-green-500 dark:text-gray-400">
              Are you sure you want to delete this comment?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() => handleDelete(commentToDelete)}>
                Yes, I'm
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

    </div>
  );
};

export default CommentSection;
