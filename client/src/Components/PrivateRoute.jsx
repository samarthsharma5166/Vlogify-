import React from 'react'
import { useSelector } from 'react-redux'
import { Link, Navigate, Outlet } from 'react-router-dom';
const PrivateRoute = () => {
    const {isLoggedIn} = useSelector((state) => state.user);
  return isLoggedIn?(<Outlet/>):(<Navigate to="/sign-in"/>)
}

export default PrivateRoute
