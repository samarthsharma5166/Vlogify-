import { Link } from "react-router-dom"
const Blogcard = ({ blog }) => {
    return (
        <div className="group relative w-full border h-[420px] border-teal-500 overflow-hidden rounded-lg sm:w-[430p] group-hover:border-2 transition-all duration-300 ">
            <Link to={`/post/${blog.slug}`}>
                <img srcSet={blog.image.secure_url} alt="blog cover" className="h-[260px] w-full object-cover group-hover:scale-95 transition-all duration-300 z-20 " />
            </Link>
            <div className="p-3 flex flex-col gap-1">
                <p className="text-lg font-semibold line-clamp-2">{blog.title}</p>
                <span className="italic text-sm">{blog.category}</span>
                <Link to={`/post/${blog.slug}`} className="z-10 group-hover:bottom-0 absolute bottom-[-200px] transition-all duration-300 left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white text-center py-2 rounded-md !rounded-tl-none !rounded-tr-none m-2">
                    Read Artical
                </Link>
            </div>
        </div>
    )
}

export default Blogcard