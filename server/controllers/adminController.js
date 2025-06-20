import jwt from 'jsonwebtoken'
import Blog from '../models/Blog.js';
import Comment from '../models/Comments.js';

export const adminLogin = async (req, res) => {
    try {
        //from req body we will get email and password
        const {email, password} = req.body;

        if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
            return res.json({success: false, message: "Invalid Credentials"})
        }

        //if email and password is mathching then we will generate a token
        const token = jwt.sign({email}, process.env.JWT_SECRET)  //secret key is stored in the environment variable

        //we will send this token in the response
        res.json({success: true, token})

    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

//we have created a controller function which allows admin to login now we have to create the api using this function so first we create a route




//controller function to get all blog post whether the isPublished property is true or false
export const getAllBlogsAdmin = async (req, res) => {
    try {
        const blogs = await Blog.find({}).sort({createdAt: -1}); // Sort the results in descending order of createdAt.  
        res.json({success: true, blogs})
        
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}



//controller function to get all comments whether it is approved or not 
export const getAllComments = async (req, res) => {
    try {
        const comments = await Comment.find({}).populate("blog").sort({createdAt: -1});
        res.json({success: true, comments})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}


//controller function to get the all dashboard data
export const getDashboard = async (req, res) => {
    try {
        const recentBlogs = await Blog.find({}).sort({createdAt: -1}).limit(5);
        const blogs = await Blog.countDocuments();  //it will give the total number of blogs
        const comments =await Comment.countDocuments(); //it will give the total number of comments
        const drafts = await Blog.countDocuments({isPublished: false}) // unpublished blog posts are saved in the drafts

        const dashboardData = { 
            blogs, comments, drafts, recentBlogs  //we have to send this data as response
        }

        res.json({success: true, dashboardData})

    } catch (error) {
        res.json({success: false, message: error.message})
    }   
}


//controller function to delete the comment by Id
export const deleteCommentById = async (req, res) => {
    try {
        const {id} = req.body;
        await Comment.findByIdAndDelete(id);
        res.json({success: true, message: "Comment deleted successfully"})   
    } catch (error) {
       res.json({success: false, message: error.message}) 
    }
}


//controller function to Approve the comment by Id
export const approveCommentById = async (req, res) => {
    try {
        const {id} = req.body;
        await Comment.findByIdAndUpdate(id, {isApproved: true});
        res.json({success: true, message: "Comment approved successfully"}); 
    } catch (error) {
       res.json({success: false, message: error.message}) 
    }
}