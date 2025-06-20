import React, { useState, useRef } from 'react'
import { blog_data, blogCategories } from '../assets/assets'
import { motion } from "motion/react"
import BlogCard from './BlogCard'
import { useAppContext } from '../context/AppContext'

const BlogList = () => {

    const [menu, setMenu] = useState("All") /* by default all categories are selected */

    //displaying blog data from database
    const { blogs, input } = useAppContext()

    // reference for each category button
    const categoryRefs = useRef({})

    const handleCategoryClick = (item) => {
        setMenu(item)
        categoryRefs.current[item]?.scrollIntoView({
            behavior: 'smooth',
            inline: 'center',
            block: 'nearest'
        })
    }

    //for filtering the blog data
    const filteredBlogs = () => {
        if (input === '') {
            return blogs
        }
        return blogs.filter((blog) => blog.title.toLowerCase().includes(input.toLowerCase()) || blog.category.toLowerCase().includes(input.toLowerCase()))
    }

    return (
        <div>
            <div className='flex justify-start sm:justify-center gap-4 sm:gap-8 my-10 relative whitespace-nowrap px-4 overflow-x-auto'>
                {/* ----categories link to filter the blogs */}
                {blogCategories.map((item) => (
                    <div key={item} className='relative' ref={(el) => categoryRefs.current[item] = el}>
                        <button onClick={() => handleCategoryClick(item)}
                            className={`cursor-pointer text-gray-500 ${menu === item &&
                                'text-white px-4 pt-0.1'}`}>
                            {item}
                            {menu === item && (
                                <motion.div layoutId='underline'
                                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                    className='absolute inset-y-0 left-0 right-0 bg-primary rounded-full -z-10'></motion.div>
                            )}
                        </button>
                    </div>
                ))}
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mb-24 mx-8 sm:mx-16 xl:mx-40'>
                {/* ----Blog cards----- */}
                {filteredBlogs().filter((blog) => menu === "All" ? true : blog.category === menu).map((blog) => <BlogCard key={blog._id} blog={blog} />)}
            </div>
        </div>
    )
}

export default BlogList
