import {createAsyncThunk} from '@reduxjs/toolkit'
import axiosInstance from '../../Helper/axiosInstance'
import {toast} from 'react-hot-toast'

export const createPost =createAsyncThunk('post/create',(async(data)=>{
    try {
        const formData = new FormData();
        formData.append('title',data.title);
        formData.append('content',data.content);
        formData.append('image',data.image);
        formData.append('category',data.category);
        const res = axiosInstance.post(`api/post/create`,formData);
        toast.promise(res,{
            loading:"Wait!...",
            success:(data)=>{
                return data?.data?.message;
            },
            error:"Failed to post a blog"
        });
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
        return
    }
}))

export const getUserPosts = createAsyncThunk('post/getposts',async(data,{getState})=>{
    try {
        const state = getState();
        const Id = state.user.user._id;
        const res = axiosInstance.get(`api/post/getposts?userId=${Id}&limit=${data}`);
        toast.promise(res,{
            loading:"Wait!...",
            success:(data)=>{
                return data?.data?.message;
            },
            error:"Failed to load user data!"
        });
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
        return
    }
})
export const deleteBlog = createAsyncThunk('post/getposts',async(data,{getState})=>{
    try {
        const res = axiosInstance.delete(`api/post/delete/${data}`);
        toast.promise(res,{
            loading:"Wait!...",
            success:(data)=>{
                return data?.data?.message;
            },
            error:"Failed to delete!"
        });
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
        return
    }
})
export const getMorePosts = createAsyncThunk('post/getposts',async(data,{getState})=>{
    try {
        const state = getState();
        const Id = state.user.user._id;
        const res = axiosInstance.get(`api/post/getposts?userId=${Id}&startIndex=${data}`);
        toast.promise(res,{
            success:(data)=>{
                return data?.data?.message;
            },
            error:"Failed to load more posts!"
        });
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
        return
    }
})
export const getBlogById = createAsyncThunk('post/getBlogById',async(data,{getState})=>{
    try {
        const state = getState();
        const Id = state.user.user._id;
        const res = axiosInstance.get(`api/post/getposts?userId=${Id}&postId=${data}`);
        toast.promise(res,{
            success:(data)=>{
                return data?.data?.message;
            },
            error:"Failed to load data!"
        });
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
        return
    }
})
export const updatePostById = createAsyncThunk('post/getBlogById',async(data,{getState})=>{
    try {
        const state = getState();
        const Id = state.user.user._id;
        const formData = new FormData();
        if(data.userInput.title){
            formData.append("title",data.userInput.title);
        }
        if(data.userInput.category){
            formData.append("category",data.userInput.category);
        }
        if(data.userInput.content){
            formData.append("content",data.userInput.content);
        }
        if(data.userInput.image){
            formData.append("image",data.userInput.image);
        }
        const res = axiosInstance.post(`api/post/update/${data.postId}/${Id}`,formData);
        toast.promise(res,{
            loading:'wait updating...',
            success:(data)=>{
                return data?.data?.message;
            },
            error:"Failed to update data!"
        });
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
        return
    }
})

export const getBlogBySlug = createAsyncThunk('post/getBlogById',async(data,{getState})=>{
    try {
        const state = getState();
        const Id = state.user.user._id;
        const res = axiosInstance.get(`api/post/getposts?slug=${data}`);
        toast.promise(res,{
            loading:"Wait!...",
            success:(data)=>{
                return data?.data?.message;
            },
            error:"Failed to load Blog!"
        });
        return (await res).data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
        return 
    }
})

