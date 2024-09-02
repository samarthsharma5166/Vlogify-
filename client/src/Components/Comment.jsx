import React, { useEffect, useState } from "react";
import axiosInstance from "../Helper/axiosInstance";
import { FaThumbsUp } from "react-icons/fa";
import moment from "moment";
import { useSelector } from "react-redux";
import { Button, Textarea } from "flowbite-react";
import toast from "react-hot-toast";
const Comment = ({ comment, onLike,onEdit,onDelete }) => {
  const [userdata, setUserdata] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const { user } = useSelector((state) => state.user);

  const getUser = async () => {
    try {
      const res = await axiosInstance.get(`api/user/${comment.userId}`);
      if (res.data.success) {
        const data = res.data.user;
        setUserdata(data);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const handleSave = async () => {
    try {
      const res = await axiosInstance.put(`api/comment/editComment/${comment._id}`, {
        content: editedContent,
      });
      if (res.data.success) {
        setEditing(false);
        onEdit(res.data.comment, editedContent);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
  useEffect(() => {
    getUser();
  }, [comment]);
  return (
    <div className="flex p-4 border-b dark:border-gray-600">
      <div className="flex-shrink-0 mr-3">
        <img
          src={userdata?.avatar?.secure_url}
          alt="user profile"
          className="w-10 h-10 rounded-full bg-gray-200"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs truncate">
            {userdata ? `@${userdata.username}` : `anonymous user`}
          </span>
          <span className="text-gray-500 text-xs">
            {moment(comment.createdAt).fromNow()}
          </span>
        </div>
        {editing ? (
          <>
            <Textarea
            placeholder="Add a comment..."
            cla
            rows={3}
            maxLength={200}
            onChange={(e) => setEditedContent(e.target.value)}
            value={editedContent}
            className="w-full p-2 text-gray-700 bg-gray-200 rounded-md resize-none focus:outline-none dark:bg-[rgb(16,23,42)] dark:text-gray-200"
          />
            <div className="flex justify-end gap-2 mt-2">
              <Button
                type="button"
                size={"sm"}
                gradientDuoTone={"purpleToBlue"}
                onClick={handleSave}
              >
                Save
              </Button>
              <Button
                type="button"
                size={"sm"}
                gradientDuoTone={"purpleToBlue"}
                outline
                onClick={() => setEditing(!editing)}
              >
                Cancel
              </Button>
              
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-500 mb-2">{comment.content}</p>
            <div className="flex items-center gap-2 pt-2 text-xs border-t dark:border-gray-700 max-w-fit">
              <button
                type="button"
                className={`text-gray-400 hover:text-blue-500 ${
                  user && comment.likes.includes(user._id) && "!text-blue-500"
                }`}
                onClick={() => onLike(comment._id)}
              >
                <FaThumbsUp className="text-sm" />
              </button>
              <p className="text-green-500">
                {comment.numberOfLikes > 0 &&
                  comment.numberOfLikes +
                    " " +
                    (comment.numberOfLikes === 1 ? "like" : "likes")}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="text-gray-400 hover:text-blue-500"
                  onClick={() => setEditing(!editing)}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="text-gray-400 hover:text-red-500"
                  onClick={() => onDelete(comment._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Comment;
