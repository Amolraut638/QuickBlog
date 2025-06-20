import express from 'express'
import { addBlog, addComment, deleteBlogById, generateContent, getAllBlogs, getBlogById, getBlogComments, togglePublish } from '../controllers/blogController.js'
import upload from '../middleware/multer.js'
import auth from '../middleware/auth.js'

const blogRouter = express.Router()

blogRouter.post("/add", upload.single('image'),auth, addBlog);
//here we have to middleware that will parse the image uplaod from frontend so for parsing we use multer package.using multer we create middleware
blogRouter.get('/all', getAllBlogs);
blogRouter.get('/:blogId', getBlogById);
blogRouter.post('/delete',auth, deleteBlogById); //only admin can delete this blog so the auth middleware is used in this route
blogRouter.post('/toggle-publish',auth, togglePublish);

//api endpoinnts for addComment and getBlogComment functions
blogRouter.post('/add-comment', addComment);
blogRouter.post('/comments', getBlogComments);

blogRouter.post('/generate',auth, generateContent);

export default blogRouter;   