import {createAsyncThunk} from '@reduxjs/toolkit'
import axiosInstance from '../../Helper/axiosInstance'
import {toast} from 'react-hot-toast'

export const createComment = createAsyncThunk('comment/create',async(data,{getState})=> {
    try {
        const state = getState();
        const userId = state.user.user._id;
        const res = axiosInstance.post(`api/comment/create`,{
            content:data.content,
            blogId :data.blogId,
            userId
        });
        toast.promise(res,{
            loading:"Wait!",
            success:(data)=>{
                return data?.data?.message;
            },
            error:"Failed to comment!"
        })
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
        return
    }
    
});
export const getCommentsById = createAsyncThunk('comment/create',async(data)=> {
    try {
        const res = axiosInstance.get(`api/comment/getPostById/${data}`);
        toast.promise(res,{
            loading:"Wait!",
            success:(data)=>{
                return data?.data?.message;
            },
            error:"Failed to fetch comment!"
        })
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
        return
    }
    
});

export const deleteComment = createAsyncThunk('comment/delete',async(data)=> {
    try {
        const res = axiosInstance.delete(`api/comment/deleteComment/${data}`);
        toast.promise(res,{
            loading:"Wait!",
            success:(data)=>{
                return data?.data?.message;
            },
            error:"Failed to delete comment!"
        })
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
        return
    }
});

export const userComment = createAsyncThunk('comment/userComment',async(data)=> {
    try {
        const res = axiosInstance.get(`api/comment/getUserComment?startIndex=${data}`);
        toast.promise(res,{
            loading:"Wait!",
            success:(data)=>{
                return data?.data?.message;
            },
            error:"Failed to fetch comment!"
        })
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
        return
    }
    
});
export const userdashComment = createAsyncThunk('comment/userComment',async(data)=> {
    try {
        const res = axiosInstance.get(`api/comment/getUserComment?limit=${data}`);
        toast.promise(res,{
            loading:"Wait!",
            success:(data)=>{
                return data?.data?.message;
            },
            error:"Failed to fetch comment!"
        })
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
        return
    }
    
});