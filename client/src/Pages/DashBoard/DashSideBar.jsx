import React, { useEffect, useState } from "react";
import { Sidebar } from "flowbite-react";
import { HiAnnotation, HiArrowSmRight, HiChartPie, HiDocument, HiDocumentText, HiUser } from "react-icons/hi";
import { FaUsers } from "react-icons/fa";
import { useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
const DashSideBar = () => {
  const location = useLocation();
  const [tab, setTab] = useState();
  const{isLoggedIn} = useSelector((state) => state.user);
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFormUrl = urlParams.get("tab");
    setTab(tabFormUrl);
  }, [location.search]);
  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.Items>
        <Sidebar.ItemGroup className="flex flex-col gap-1">
        {
          isLoggedIn && <Link to="/dashboard?tab=dash">
            <Sidebar.Item
              active={tab === "dash" || !tab}
              icon={HiChartPie}
              as="div"
            >
              Dashboard
            </Sidebar.Item>
          </Link>
        }
          <Link to="/dashboard?tab=profile">
            <Sidebar.Item
              active={tab === "profile"}
              icon={HiUser}
              label={"USER"}
              labelColor="dark"
              as="div"
            >
              Profile
            </Sidebar.Item>
          </Link>
          <Link to="/dashboard?tab=posts">
            <Sidebar.Item
              active={tab === "posts"}
              icon={HiDocumentText}
              as="div"
            >
              Posts
            </Sidebar.Item>
          </Link>
          <Link to="/dashboard?tab=users">
            <Sidebar.Item
              active={tab === "posts"}
              icon={FaUsers}
              as="div"
            >
              Users
            </Sidebar.Item>
          </Link>
          <Link to="/dashboard?tab=comments">
            <Sidebar.Item
              active={tab === "comments"}
              icon={HiAnnotation}
              as="div"
            >
              Comments
            </Sidebar.Item>
          </Link>
          
          <Sidebar.Item icon={HiArrowSmRight} className="cursor-pointer ">
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashSideBar;
