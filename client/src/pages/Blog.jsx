import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { assets, blog_data, comments_data } from '../assets/assets'
import Navbar from '../components/Navbar'
import Moment from 'moment'
import Footer from '../components/Footer'
import Loader from '../components/Loader'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const Blog = () => {

  const { id } = useParams()

  //using axios to get the blog data from database
  const {axios} = useAppContext()

  const [data, setData] = useState(null)  //the blogdata is stored in these variables
  const [comments, setComments] = useState([])
  const [name, setName] = useState('')
  const [content, setContent] = useState('')




  const fetchBlogData = async () => {
   /*
      this code in fetching the dummy data so we comment it 
    const data = blog_data.find(item => item._id === id)
    setData(data) */

    //this function will get the data from database
    try {
      const {data} = await axios.get(`/api/blog/${id}`)  //we get individual blog data from the api
      data.success ? setData(data.blog) : toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  //we have to display this blog data in webpage so we have to call this fetchBlogData function so we use useEffect hook



  const fetchComments = async () => {
    //setComments(comments_data) this code is again displaying the dummy data so we comment it
    try {
      const {data} = await axios.post('/api/blog/comments', {blogId: id})
      if(data.success){
        setComments(data.comments)
      } else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }



  //function to add the new comment
  const addComment = async (e) => {
    e.preventDefault()
    try {
      const {data} = await axios.post('/api/blog/add-comment', {blog: id, name, content})
      if(data.success){
        toast.success(data.message)
        setName('')
        setContent('')
      } else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }



  useEffect(() => {
    fetchBlogData()   //when component gets loaded it will execute this function and then data is stored in the setData
    fetchComments()
  }, [])

  return data ? (
    //if the data is available then only we return this div
    <div className='relative'>

      <img className='absolute -top-50 -z-1 opacity-50' src={assets.gradientBackground} alt="" />

      <Navbar />

       {/* title, small description, author name, published date */}
      <div className='text-center mt-20 text-gray-600'>
       
        <p className='text-primary py-4 font-medium'>Published on {Moment(data.createdAt).format('MMMM Do YYYY')}</p>
        <h1 className='text-2xl sm:text-5xl font-semibold max-w-2xl mx-auto text-gray-800'>{data.title}</h1>
        <h2 className='my-5 max-w-lg truncate mx-auto' dangerouslySetInnerHTML={{ __html: data.subTitle }}/>
        <p className='inline-block py-1 px-4 rounded-full mb-6 border text-sm border-primary/35 bg-primary/5 font-medium text-primary'>Amol Raut</p>

      </div>

      {/* thumbnail image, blog description comments, comments box, social media icons */}
      <div className='mx-5 max-w-5xl md:mx-auto my-10 mt-6'>
        
        <img className='rounded-3xl mb-5' src={data.image} alt="" />
        <div className='rich-text max-w-3xl mx-auto' dangerouslySetInnerHTML={{__html: data.description}}></div>

        {/* --- comments section --- */}
        <div className='mt-14 mb-10 max-w-3xl mx-auto'>
          <p className='font-semibold mb-4'>Comments ({comments.length})</p> {/* we will see the total number of comments  */}
          <div className='flex flex-col gap-4'> 
            {comments.map((item, index)=>(
              <div key={index} className='relative bg-primary/2 border border-primary/5 max-w-xl p-4 rounded text-gray-600'>
                  <div className='flex items-center gap-2 mb-2'>
                    <img src={assets.user_icon} alt="" className='w-6' />
                    <p className='font-medium'>{item.name}</p>
                  </div>
                  <p className='text-sm max-w-md ml-8'>{item.content}</p>
                  <div className='absolute right-4 bottom-3 flex items-center gap-2 text-xs'>{Moment(item.createdAt).fromNow()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ---Add comment section ---- */}
        <div className='max-w-3xl mx-auto'>
          <p className='font-semibold mb-4'>Add your comment </p>
          <form onSubmit={addComment} className='flex flex-col items-start gap-4 max-w-lg'>

            <input onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder='Name' required className='w-full p-2 border border-gray-300 rounded outline-none'/>

            <textarea onChange={(e) => setContent(e.target.value)} value={content} placeholder='Comment' className='w-full p-2 border border-gray-300 rounded outline-none h-48'></textarea>

            <button type='submit' className='bg-primary text-white rounded p-2 px-8 hover:scale-102 transition-all cursor-pointer'>Submit</button>
          </form>
        </div>

        {/* share buttons or social media icons */}
        <div className='my-24 max-w-3xl mx-auto'>
            <p className='font-semibold my-4'>Share this article on social media</p>
            <div className='flex'> 
              <img className='cursor-pointer' src={assets.facebook_icon} width={50} alt="" />
              <img className='cursor-pointer' src={assets.twitter_icon} width={50} alt="" />
              <img className='cursor-pointer' src={assets.googleplus_icon} width={50} alt="" />
            </div>
        </div>

      </div>

      <Footer/>

    </div>

  ) : <Loader/>
}

export default Blog