import fs from 'fs'  // fs is the file system
import imagekit from '../configs/imagekit.js';
import Blog from '../models/Blog.js';
import Comment from '../models/Comments.js';
import main from '../configs/gemini.js';


//controller function to add the blog
export const addBlog = async (req, res) => {
    try {
        const {title, subTitle, description, category, isPublished} = JSON.parse(req.body.blog);
        //this data will store in the property called blog in the request body and data is in string format so we parse it to json

        //blog image
        const imageFile = req.file;

        //check if all fields are present
        if(!title || !description || !category || !imageFile){
            return res.json({success: false, message: 'Missing required fields'})
        }

        //upload image to imagekit
        const fileBuffer = fs.readFileSync(imageFile.path)
        const response = await imagekit.upload({
            file : fileBuffer,
            fileName : imageFile.originalname,
            folder : "/blogs"
        })

        //from this response we will get the url property ie link of the uploaded image but we are not going to store this image in 
        //database instead we are going to store the imagekit url in the database and then we will optimise it

        //optimization through imagekit url transformation
        const optimizedImageUrl = imagekit.url({
            path : response.filePath,
            transformation : [
                {quality : 'auto'}, //auto compression
                {format : 'webp'},  //convert to modern format
                {width : '1280'} // width resizing
            ]
        });

        //store the url of optimized image in the image variable
        const image = optimizedImageUrl;

        //saving this data in mongoDB database
        await Blog.create({title, subTitle, description, category, image, isPublished})

        res.json({success: true, message: "Blog added succesfully"})

    } catch (error) {
        res.json({success: false, message: error.message})
    }
}


//controller function to get all the blog data
export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({isPublished: true}) //find all the blogs which are published and store in the blogs variable
        res.json({success: true, blogs})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}


//controller function to get the individual blog data
export const getBlogById = async (req, res) => {
    try {
        const { blogId }  = req.params;
        const blog = await Blog.findById(blogId)
        if (!blog) {
            return res.json({success: false, message: "Blog not found"});
        }
        res.json({success: true, blog});
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}


//controller function to delete the blog by id
export const deleteBlogById = async (req, res) => {
    try {
        const { id }  = req.body;
        await Blog.findByIdAndDelete(id)  //we are using the Blog model to delete the blog

        //delete all the comments asscociated with this blog
        await Comment.deleteMany({blog: id})
        
        res.json({success: true, message: "Blog deleted successfully"});
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}


//controller function to publish and unpublish the blog
export const togglePublish = async (req, res) => {
    try {
        const { id }  = req.body;
        const blog = await Blog.findById(id);
        blog.isPublished = !blog.isPublished;  //change from false to true and true to false
        await blog.save();
        res.json({success: true, message: "Blog status updated"});
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}


//controller function to add the new comment in the blog post 
export const addComment = async (req, res) => {
    try {
        const {blog, name, content} = req.body;  //from the req.body and frontend we are getting the blog id, name and content
        await Comment.create({blog, name, content}); // by default isApproved is false so admin can approve it later
        res.json({success: true, message: "Comment added for review"});
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}


//controller function to display the comments data for individual blog on frontend
export const getBlogComments = async (req, res) => {
    try {
        const {blogId} = req.body;
        const comments = await Comment.find({blog: blogId, isApproved: true}).sort({createdAt: -1})
        res.json({success: true, comments})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}


// controller function to generate the content using AI
export const generateContent = async (req, res) => {
    try {
        const {prompt} = req.body;
        const content = await main(prompt + 'Generate a blog content for this topic in simple text format')
        res.json({success: true, content})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}