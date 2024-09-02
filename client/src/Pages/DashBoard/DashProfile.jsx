import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaRegUser } from "react-icons/fa";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { TextInput, Button } from "flowbite-react";
import toast from "react-hot-toast";
import { FaEye, FaRegEyeSlash } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { deleteUser, logoutUser, updateUser } from "../../redux/user/userSlice.js";
import { isEmail, passChecker } from "../../Helper/Validation.js";
// gsap packages
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Link, Navigate } from "react-router-dom";
// flowbyte
import { Modal } from "flowbite-react";
const DashProfile = () => {
  const profileContainer = useRef();
  const imageContainer = useRef();
  // Gsap animation
  useGSAP(() => {
    gsap.from(profileContainer.current, {
      scale: 0,
      opacity: 0,
      borderRadius: "50%",
      duration: 0.8,
    });
    gsap.from(imageContainer.current, {
      width: 0,
      height: 0,
      opacity: 50,
      borderRadius: "0%",
      duration: 2.5,
      ease: "slow(0.7,0.7,false)",
    });
  });
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [image, setImage] = useState(null);
  const [formData, setformData] = useState({});
  const [passVisible, setPassVisible] = useState(false);
  const [prevImage, setPreImage] = useState(false);
  const [showModel, setShowModel] = useState(false);
  function getImage(e) {
    e.preventDefault();
    const uploadImage = e.target.files[0];
    if (uploadImage) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(uploadImage);
      fileReader.addEventListener("load", function () {
        setImage(this.result);
        setformData({
          ...formData,
          avatar: uploadImage,
        });
      });
    }
  }
  const handleInput = (e) => {
    setformData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleFormData = async (e) => {
    e.preventDefault();

    if (Object.keys(formData).length === 0) {
      return;
    }

    if (formData.email) {
      if (!isEmail(formData.email)) {
        toast.error("Please enter a valid email!😒");
        return;
      }
    }

    if (formData.password) {
      if (!passChecker(formData.password)) {
        toast.error(
          "password should be 8 character long and it must contain one uppecase, one lowercase and special character"
        );
        return;
      }
    }
    try {
      const res = await dispatch(updateUser(formData));
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const handleDeleteUser = async () => {
    try {
        setShowModel(false);
        const res = await dispatch(deleteUser());
        if (res?.payload?.success) {
          <Navigate to="/sign-up"/>;
        }
    } catch (error) {
      toast(error?.response?.data?.message);
      return;
    }
  };

  const handleLogout = async () => {
    try {
      const res = await dispatch(logoutUser());
      if (res?.payload?.success) {
        <Navigate to="/sign-in" />;
      }
    } catch (error) {
      toast(error?.response?.data?.message);
    }
  };
  return (
    <div
      className="max-w-lg mx-auto p-3 w-full border my-10 rounded-lg shadow-2xl dark:shadow-2xl]"
      ref={profileContainer}
    >
      {prevImage && (
        <div className="w-full absolute z-10" ref={imageContainer}>
          <span
            className="text-xl font-bold"
            onClick={() => setPreImage(!prevImage)}
          >
            <RxCross2 />
          </span>
          <img
            src={user.avatar.secure_url}
            className=" rounded-full mx-auto relative"
          />
        </div>
      )}
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form
        className="flex flex-col gap-4 items-center"
        onSubmit={handleFormData}
      >
        <input type="file" hidden id="profileImge" onChange={getImage} />
        <label htmlFor="profileImge" className="relative top-36 left-10">
          <BsFillPlusCircleFill className="text-2xl text-black rounded-full object-cover border-2 border-[lightgrey] dark:text-[lightgrey]" />
        </label>
        {image || user.avatar.secure_url !== "" ? (
          <div className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full">
            <img
              src={image || user.avatar.secure_url}
              alt="Profile Image"
              className="w-full h-full rounded-full object-cover border-8 border-[lightgrey]"
              id="profileImge"
              onClick={() => setPreImage(!prevImage)}
            />
          </div>
        ) : (
          <div className="w-32 h-32 self-center cursor-pointer shadow-lg overflow-hidden rounded-full">
            <FaRegUser className="w-full h-full" />
          </div>
        )}

        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={user.username}
          className="w-full"
          onChange={handleInput}
        ></TextInput>
        <TextInput
          type="text"
          id="email"
          placeholder="email"
          defaultValue={user.email}
          className="w-full"
          disabled
        ></TextInput>
        <div className="w-full">
          <TextInput
            type={passVisible ? "text" : "password"}
            id="password"
            placeholder="password"
            className="w-full"
            onChange={handleInput}
          ></TextInput>
          <span
            onClick={() => setPassVisible(!passVisible)}
            className="relative left-[93%] bottom-7"
          >
            {passVisible ? <FaRegEyeSlash /> : <FaEye />}
          </span>
        </div>
        <Button type="submit" gradientDuoTone="purpleToBlue" className="w-full" outline>
          Update
        </Button>
        <Link to='/create-post' className="text-center border w-full" >
          <Button  gradientDuoTone="purpleToPink" className="w-full">Create Post</Button>
        </Link>
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span
          onClick={() => setShowModel(true)}
          className="cursor-pointer hover:text-red-800"
        >
          Delete Account
        </span>
        <span
          onClick={handleLogout}
          className="cursor-pointer hover:text-red-800"
        >
          Sign Out
        </span>
        
      </div>
      <Modal
        show={showModel}
        onClose={() => setShowModel(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto"/>
            <h3 className="mb-5 text-lg text-green-500 dark:text-gray-400">Are you sure you want to delete you account?</h3>
            <div className="flex justify-center gap-4">
              <Button color='failure' onClick={handleDeleteUser}>Yes, I'm</Button>
              <Button color='gray' onClick={()=>setShowModel(false)}>No</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashProfile;
