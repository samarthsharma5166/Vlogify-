import React, { useRef, useState } from 'react';
import {Label,TextInput,Button,Spinner} from 'flowbite-react'
import { Link,useNavigate } from 'react-router-dom';
import { FaEye,FaRegEyeSlash  } from "react-icons/fa";
import {useDispatch} from 'react-redux'
import {createAccount, signInStart} from '../redux/user/userSlice.js'
// gsap packages
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { TextPlugin } from 'gsap/TextPlugin';
// tostiy
import { toast } from 'react-hot-toast';
// axios
import axios from 'axios'
gsap.registerPlugin(TextPlugin);

const SignUp = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  // loading and formdata state
  const [formData,setFormData]=useState({
    username:"",
    email:"",
    password:""
  });

// handling the input data
  const handleInput=(e)=>{
    setFormData({...formData,[e.target.id]:e.target.value.trim()});
  }
  // submiting the form 
  const handleSubmit=async(e)=>{
    e.preventDefault();
    try {
      if(!formData.username||!formData.email||!formData.password){
        return toast.warning("All fields are required!😢");
      }
      if(formData.username.length<5){
        return toast.warning("Username should contain atleast 5 character")
      }
      const emailRegEx = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g
      if (!formData.email.match(emailRegEx)) {
        return toast.warning("Please enter a valid email!😒")
      }

      const passwordRegEx = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm
      if (!formData.password.match(passwordRegEx)) {
        return toast.error("password should be 8 character long and it must contain one uppecase, one lowercase and special character")
      }

      const response = await dispatch(createAccount(formData));
      
      if (response?.payload?.success) 
        navigate("/sign-in");

      setFormData({
        username:"",
        email:"",
        password:""
      });


    } catch (error) {
      return toast(error?.response?.data?.message);
    }
  }
// ref for signup and text container
  const signupContainer = useRef();
  const textBox= useRef(); 
  const [passVisible,setPassVisible] = useState();
  // Gsap animation
  useGSAP(()=>{
    gsap.from(signupContainer.current,{
      y:-200,
      opacity:0,
      borderBottomLeftRadius:"50%",
      borderBottomRightRadius:"50%",
      duration:0.8,
      stagger:true
    });
    gsap.to(textBox.current,{
      duration: 1,
      text: "Create Your Account and Start Sharing Your Stories",
      ease: "none",
      repeat:-1,
      yoyo:true,
      repeatDelay:1
    })
    
  })
  return (
    <div className='min-h-screen mt-20 p-4 md:p-0 overflow-hidden'>
      <div className='flex max-w-3xl mx-auto flex-col md:flex-row md:items-center md:gap-5'>
        {/* left */}
        <div className='flex-1'>
          {/* logo */}
          <Link to='/' className='font-bold text-4xl dark:text-white hover:scale-95 transition-all'>
            <span className='px-3 py-1.5 bg-gradient-to-r from-[#00c6ff] to-[#0072ff] rounded-2xl text-white'>Vlogify!</span>
          </Link>
          {/* Writting text */}
          <p className='text-sm mt-5 h-1 mb-7' ref={textBox}></p>
        </div>
        {/* Right */}
        <div className='flex-1 overflow-hidden mt-4' ref={signupContainer}>
          {/* form */}
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value='Your username'/>
              <TextInput type='text' placeholder='Username' id='username'  value={formData.username} onChange={handleInput}/>
            </div>
            <div>
              <Label value='Your email'/>
              <TextInput type='email' placeholder='name@company.com' id='email' value={formData.email} onChange={handleInput} />
            </div>
            <div>
              <Label value='Your password'/>
              <TextInput type={passVisible?"text":"password"} placeholder='********' id='password'value={formData.password} onChange={handleInput} />
              <span onClick={()=>setPassVisible(!passVisible)} className='relative left-[93%] bottom-7'>{passVisible?<FaRegEyeSlash />:<FaEye />}</span>
            </div>
            <Button gradientDuoTone='purpleToBlue' type='submit'>Sign Up</Button>
          </form>
          <div className='text-sm mt-3'>
            <span className='pr-1'>Have an account?</span>
            <Link to='/sign-in' className='text-blue-500'>Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp
