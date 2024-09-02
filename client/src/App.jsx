import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./Pages/Home";
import About from "./Pages/About";
import SignUp from "./Pages/SignUp";
import Signin from "./Pages/Signin";
import Projects from "./Pages/Projects";
import Dashboard from "./Pages/DashBoard/Dashboard";
import Headers from "./Components/Headers";
import Footer from "./Components/FooterCom";
import CreatePost from "./Pages/CreatePost";
import PrivateRoute from "./Components/PrivateRoute";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import UpdatePost from "./Pages/UpdatePost";
import Postpage from "./Pages/Postpage";
import ScrollToTop from "./Components/ScrollToTop";
import Search from "./Pages/Search";
gsap.registerPlugin(useGSAP);

function App() {
  return (
    <>
      <ScrollToTop />
      <Headers />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<Signin />} />
        <Route path="/search" element={<Search/>} />
        <Route path="/blogs" element={<Projects />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:postId" element={<UpdatePost />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/post/:slug" element={<Postpage />} />
        </Route>
      </Routes>
      <Footer />
    </>
  );
}

export default App;
