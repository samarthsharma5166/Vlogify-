import React, { useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { IoMdImages } from "react-icons/io";
import { TextInput, Select, FileInput, Button } from "flowbite-react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { createPost } from "../redux/Blog/blogSlice";
import { useNavigate } from "react-router-dom";
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
const CreatePost = () => {
  const [userInput, setUserInput] = useState({});
  const [image, setImage] = useState(null);
  const uploadImageRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  function handleUserInput(e) {
    const { id, value } = e.target;
    setUserInput({
      ...userInput,
      [id]: value,
    });
  }

  function getImage(e) {
    e.preventDefault();
    const uploadImage = e.target.files[0];
    if (uploadImage) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(uploadImage);
      fileReader.addEventListener("load", function () {
        setImage(this.result);
        setUserInput({
          ...userInput,
          image: uploadImage,
        });
      });
    }
  }

   async function handlePost(e) {
    e.preventDefault();
    if(!userInput.title||!userInput.content||!userInput.category||!userInput.image){
        toast.error("All fields are required! 🤷‍♀️");
        return;
    }
    if(userInput.title.length<5){
        toast.error('title must be atleast 5 character long');
        return;
    }
    if(userInput.content.length<10){
        toast.error('content must be atleast 10 character long');
        return;
    }
    try {
      const res = await dispatch(createPost(userInput));
      if(res?.payload?.success){
        navigate(`/post/${res.payload.blog.slug}`);
      }
      } catch (error) {
      toast.error(error?.response?.data?.message);
      return
    }
  }
  return (
    <div className="max-w-3xl p-3 mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create Post</h1>
      <form className="flex flex-col gap-4" onSubmit={handlePost}>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            onChange={handleUserInput}
          />
          <Select id="category" onChange={handleUserInput}>
            <option value="UNCATEGORISED" id="category">Select</option>
            {category.map((cat,idx) => (
              <option key={idx} value={cat} id="category">{cat}</option>
            ))}
          </Select>
        </div>
        <div className="flex flex-col sm:flex-row justify-evenly items-center gap-10 border-4 border-teal-500 border-dotted p-3">
          <input
            type="file"
            id="blogImage"
            accept="image/*"
            onChange={getImage}
            ref={uploadImageRef}
            hidden
          />
          {
            image ? <img src={image} className="w-36 object-contain transition-all ease-in-out duration-300"/>:
            (
                <div>
                    <IoMdImages  className="text-5xl font-semibold"/><span className="font-semibold">Choose</span>
                </div>
            )
           }
          <label htmlFor="blogImage">
            <Button
              type="button"
              gradientDuoTone="purpleToBlue"
              size="sm"
              outline
              id="blog-image"
              onClick={() => uploadImageRef.current.click()}
              className="transition-all ease-in-out duration-300"
            >
              Upload image
            </Button>
          </label>
        </div>
        <ReactQuill
          theme="snow"
          placeholder="Write something..."
          className="h-72 mb-12"
          required
          id="content"
          onChange={(value) => setUserInput({ ...userInput, content: value })}
        />
        <Button gradientDuoTone="purpleToPink" type="submit">
          Publish
        </Button>
      </form>
    </div>
  );
};

export default CreatePost;
