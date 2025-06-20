import mongoose, { model } from "mongoose";


const commentSchema = new mongoose.Schema({
    blog : { type: mongoose.Schema.Types.ObjectId, ref: 'blog', required: true },
    name : { type: String, required: true },
    content : { type: String, required: true },
    isApproved : { type: Boolean, default: false },
},{timestamps: true});

// we have created above schema and using this schema we create the below model

const Comment = mongoose.model('Comment', commentSchema); 

export default Comment;