import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Navbar, TextInput, Button, Dropdown, Avatar, Toast } from "flowbite-react";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon,FaSun } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/theme/themeSlice.js";
import toast from "react-hot-toast";
import { logoutUser } from "../redux/user/userSlice.js";
import { useEffect, useState } from "react";
const Headers = () => {
  const path = useLocation().pathname;
  const dispatch = useDispatch();
  const {isLoggedIn,user} = useSelector((state) => state.user);
  const {theme} = useSelector((state) => state.theme);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermUrl = urlParams.get("searchTerm");
    if (searchTermUrl) {
      setSearchTerm(searchTermUrl);
    }
  },[location.search]);
  const handleLogout=async()=>{
    try {
      const res = await dispatch(logoutUser());
      if(res?.payload?.success){
        <Navigate to="/sign-in"/>
      }
    } catch (error) {
      toast(error?.response?.data?.message);
    }
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  }
  return (
    <Navbar className="border-b-2">
      <Link
        to="/"
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white hover:scale-95 transition-all"
      >
        <span className="px-3 py-1.5 bg-gradient-to-r from-[#00c6ff] to-[#0072ff] rounded-2xl text-white ">
          Vlogify!
        </span>
      </Link>
      <form onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      <Link to="/search">
      <Button className="w-12 h-10 lg:hidden" color="grey" pill>
        <AiOutlineSearch />
      </Button>
      </Link>
      <div className="flex gap-2 md:order-2">
        <Button className="w-12 h-10 hidden sm:inline" color="grey" pill  onClick={()=>dispatch(toggleTheme())}>
          {
            (theme==="light")?<FaMoon/>:<FaSun/>
          }
        </Button>
        {
          isLoggedIn? (
            <Dropdown arrowIcon={false} inline label={<Avatar alt="avatar" img={user?.avatar?.secure_url} rounded/>}>  {/*  */}
              <Dropdown.Header>
                <span className="block text-sm  border-b-stone-400">{user.username}</span>
                <span className="block text-sm font-medium truncate">{user.email}</span>
              </Dropdown.Header>
              <Link to='/dashboard?tab=profile'>
              <Dropdown.Item>
                Profile  
              </Dropdown.Item>
              </Link>
              <Dropdown.Divider/>
              <Dropdown.Item onClick={handleLogout}>
                Sign out  
              </Dropdown.Item>
            </Dropdown>
          ):(
            <Link to="/sign-in">
          <Button gradientDuoTone="purpleToBlue" className="rounded-xl" outline>
            Sign In
          </Button>
        </Link>
          )
        }
        <Navbar.Toggle></Navbar.Toggle>
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === "/"} as={"div"}>
          <Link to="/">Home</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={"div"}>
          <Link to="/about">About</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/blogs"} as={"div"}>
          <Link to="/blogs">Blogs</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Headers;
