import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import axiosInstance from '../../Helper/axiosInstance'
import { toast } from 'react-hot-toast';
import  secureLocalStorage  from  "react-secure-storage";
import { useSelector } from 'react-redux';


const initialState = {
    isLoggedIn: secureLocalStorage.getItem('isLoggedIn') || false,
    user:JSON.parse(secureLocalStorage.getItem('user')) || {}
}

export const createAccount=createAsyncThunk("auth/signup",(async(data)=>{
    try {
        const res = axiosInstance.post("api/auth/signup",data);
        toast.promise(res,{
            loading:"Wait! creating your Account",
            success:(data)=>{
                return data?.data?.message;
            },
            error:'Failed! to create account',
            
        })
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
}))

export const loginAccount=createAsyncThunk("auth/login",(async(data,)=>{
    try {
        const res = axiosInstance.post("api/auth/login",data);
        toast.promise(res,{
            loading:"Wait! login",
            success:(data)=>{
                return data?.data?.message;
            },
            error:'Failed! to login',
        })
        return (await res).data;
    } catch (error) {
        if (error.response?.status === 401) {
            secureLocalStorage.clear(); // Clear storage if unauthorized
            toast.error("Session expired. Please log in again.");
        } else {
            toast.error("Failed to login");
        }
        toast.error(error?.response?.data?.message);
    }
}))

export const updateUser = createAsyncThunk(`user/update`,async(data,{getState})=>{
    const state = getState();
    const Id = state.user.user._id;
    const formData = new FormData();
    if(data.username){
        formData.append("username",data.username);
    }
    if(data.avatar){
        formData.append("avatar",data.avatar);
    }
    if(data.password){
        formData.append("password",data.password);
    }

    try {
        const res =  axiosInstance.put(`api/user/update/${Id}`,formData);
        toast.promise(res,{
            loading:"Wait! updating",
            success:(data)=>{
                return data?.data?.message;
            },
            error:'Failed! to update',
        })
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
})

export const deleteUser = createAsyncThunk(`user/delete`,async(data,{getState})=>{
    const state = getState();
    const Id = state.user.user._id;
    try {
        const res =  axiosInstance.delete(`api/user/delete/${Id}`);
        toast.promise(res,{
            loading:"Wait! loading...",
            success:(data)=>data?.data?.message,
            error:'Failed! to delete',
        })
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
})

export const logoutUser = createAsyncThunk(`auth/logout`,async()=>{
    try {
        const res = axiosInstance.get(`api/auth/logout`);
        toast.promise(res,{
            loading:"wait! logout!",
            success:(data)=>data?.data?.message,
            error:"Failed! to logout" 
        })
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
})

export const getusers = createAsyncThunk(`user/getusers`,async(data)=>{
    try {
        const res = axiosInstance.get(`api/user/getusers?startIndex=${data}`);
        toast.promise(res,{
            loading:"wait!",
            success:(data)=>data?.data?.message,
            error:"Failed! " 
        })
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
})
export const getdashusers = createAsyncThunk(`user/getusers`,async(data)=>{
    try {
        const res = axiosInstance.get(`api/user/getusers?limit=${data}`);
        toast.promise(res,{
            loading:"wait!",
            success:(data)=>data?.data?.message,
            error:"Failed! " 
        })
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
    }
})

const setTokenExpiryTimer = (expiryTime) => {
    const timeUntilExpiry = expiryTime * 60 * 1000; 
    setTimeout(() => {
        secureLocalStorage.clear(); // Clear storage when token expires
        toast.error("Session expired. Please log in again.");
    }, timeUntilExpiry);
};


const userSlice = createSlice({
    name:"user",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(loginAccount.fulfilled,(state,action)=>{
            const {user} = action.payload;
            secureLocalStorage.setItem('user',JSON.stringify(user));
            secureLocalStorage.setItem('isLoggedIn',true);
            state.user = user;
            state.isLoggedIn = true
            setTokenExpiryTimer(60);
        }),
        builder.addCase(updateUser.fulfilled,(state,action)=>{
            const{user} = action.payload
            secureLocalStorage.setItem('user',JSON.stringify(user));
            state.user= user;
        })
        builder.addCase(deleteUser.fulfilled,(state,action)=>{
            secureLocalStorage.clear();
            state.user={}
            state.isLoggedIn=false
        })
        builder.addCase(logoutUser.fulfilled,(state)=>{
            secureLocalStorage.clear();
            state.user={}
            state.isLoggedIn=false
        })
    }
})

export const {signInStart,signInSuccess,signInError} = userSlice.actions;
export default userSlice.reducer;