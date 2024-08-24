import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from 'flowbite-react'
const BlogCard2 = ({blog}) => {
  return (
    <Link to={`/post/${blog.slug}`}>
        <div className='p-6'>
      <div className='flex flex-col gap-4 md:flex-row rounded-tl-xl rounded-tr-xl rounded-bl-xl shadow-xl border w-[300px] md:w-[65.104vw] md:h-64 '>
        <div className='p-3 h-52 min-w-72 mx-auto md:mx-0'> 
            <img src={blog.image.secure_url} alt="" className='w-full h-full md:h-52 flex-2 rounded-tl-xl rounded-tr-xl md:rounded-tr-none shadow-lg object-fill' />
        </div>
        <div className='flex flex-col w-full flex-1 md:max-w-[40vw] p-3 overflow-hidden gap-3'>
            <h1 className='text-2xl font-bold p-3 tracking-wider truncate'>{blog.title}</h1>
            <p className='px-3 text-xs text-[#969696] tracking-widest'>{blog.category}</p>
            <p className='p-3 text-xs line-clamp-2 h-12'>{blog.content}</p>
            <Link to={`/post/${blog.slug}`} className='w-full'>
            <Button gradientDuoTone="purpleToPink" outline className=" rounded-br-none w-full ">Read More</Button>
            </Link>
        </div>
      </div>
    </div>
    </Link>
  )
}

export default BlogCard2
