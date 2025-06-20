import express from 'express';
import { adminLogin, approveCommentById, deleteCommentById, getAllBlogsAdmin, getAllComments, getDashboard } from '../controllers/adminController.js';
import auth from '../middleware/auth.js';

const adminRouter = express.Router();

//in above router we have to create endpoints 
adminRouter.post("/login", adminLogin)
adminRouter.get("/comments",auth, getAllComments) // we have to get comments in admin panel so we have to use auth middleware to check if user is admin or not
adminRouter.get("/blogs",auth, getAllBlogsAdmin)
adminRouter.post("/delete-comment",auth, deleteCommentById)
adminRouter.post("/approve-comment",auth, approveCommentById)
adminRouter.get("/dashboard",auth, getDashboard)

export default adminRouter;