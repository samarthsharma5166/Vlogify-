import React from "react";
import { useRef, useState } from "react";
import { Label, TextInput, Button, Spinner } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaRegEyeSlash } from "react-icons/fa";
import { isEmail, passChecker } from "../Helper/Validation.js";
// gsap packages
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { TextPlugin } from "gsap/TextPlugin";
// react-hot-toast
import { toast } from "react-hot-toast";
// redux state
import { loginAccount } from "../redux/user/userSlice.js";
import { useDispatch, useSelector } from "react-redux";
gsap.registerPlugin(TextPlugin);
const Signin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // loading and formdata state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // handling the input data
  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };
  // submiting the form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.email || !formData.password) {
        toast.error("All fields are required!😢");
        return;
      }

      if (!isEmail(formData.email)) {
        toast.error("Please enter a valid email!😒");
        return;
      }

      if (!passChecker(formData.password)) {
        toast.error(
          "password should be 8 character long and it must contain one uppecase, one lowercase and special character"
        );
        return;
      }

      const res = await dispatch(loginAccount(formData));

      if (res?.payload?.success) {
        navigate("/");
        setFormData({
          email: "",
          password: "",
        });
      }
    } catch (error) {
      toast(error?.response?.data?.message);
      return;
    }
  };
  // ref for signup and text container
  const signupContainer = useRef();
  const textBox = useRef();
  const [passVisible, setPassVisible] = useState(false);
  // Gsap animation
  useGSAP(() => {
    gsap.from(signupContainer.current, {
      y: 200,
      opacity: 0,
      borderTopLeftRadius: "50%",
      borderTopRightRadius: "50%",
      duration: 0.8,
      stagger: true,
    });
    gsap.to(textBox.current, {
      duration: 1,
      text: "Create Your Account and Start Sharing Your Stories",
      ease: "none",
      repeat: -1,
      yoyo: true,
      repeatDelay: 1,
    });
  });
  return (
    <div className="min-h-screen mt-20 p-4 md:p-0 overflow-hidden">
      <div className="flex max-w-3xl mx-auto flex-col md:flex-row md:items-center md:gap-5">
        {/* left */}
        <div className="flex-1">
          {/* logo */}
          <Link
            to="/"
            className="font-bold text-4xl dark:text-white hover:scale-95 transition-all"
          >
            <span className="px-3 py-1.5 bg-gradient-to-r from-[#00c6ff] to-[#0072ff] rounded-2xl text-white">
              Vlogify!
            </span>
          </Link>
          {/* Writting text */}
          <p className="text-sm mt-5 h-1 mb-7" ref={textBox}></p>
        </div>
        {/* Right */}
        <div className="flex-1 overflow-hidden mt-4" ref={signupContainer}>
          {/* form */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            {/*email field */}
            <div>
              <Label value="Your email" />
              <TextInput
                type="email"
                placeholder="name@company.com"
                id="email"
                value={formData.email}
                onChange={handleInput}
              />
            </div>
            {/* password field */}
            <div>
              <Label value="Your password" />
              <TextInput
                type={passVisible ? "text" : "password"}
                placeholder="********"
                id="password"
                value={formData.password}
                onChange={handleInput}
              />
              <span
                onClick={() => setPassVisible(!passVisible)}
                className="relative left-[93%] bottom-7"
              >
                {passVisible ? <FaRegEyeSlash /> : <FaEye />}
              </span>
            </div>
            <Button gradientDuoTone="purpleToBlue" type="submit">
              Sign In
            </Button>
          </form>
          <div className="text-sm mt-3">
            <span className="pr-1">Create an account?</span>
            <Link to="/sign-up" className="text-blue-500">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
