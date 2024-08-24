import React from 'react'
import { useEffect,useState } from 'react'
import { useLocation } from 'react-router-dom'
import DashSideBar from './DashSideBar'
import DashProfile from './DashProfile'
import Dashposts from './Dashposts'
import DashUsers from './DashUsers'
import DashComments from './DashComments'
import DashboardComp from '../../Components/DashboardComp'
const Dashboard = () => {
  const location = useLocation();
  const [tab,setTab] = useState();
  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search);
    const tabFormUrl = urlParams.get('tab')
    tabFormUrl && setTab(tabFormUrl);
  },[location.search])
  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='md:w-56'>
        <DashSideBar/>
      </div>
      <div className='w-full'>
        {/* PROFILE */}
        {tab==="profile"&& <DashProfile/>}
        {/* POSTS */}
        {tab==="posts"&& <Dashposts/>}
        {/* USERS */}
        {tab==='users' && <DashUsers/>}
        {/* COMMENTS */}
        {tab==='comments' && <DashComments/>}
        {/* DASHBOARD */}
        {tab==='dash' && <DashboardComp/>}
      </div>
    </div>
  )
}

export default Dashboard
