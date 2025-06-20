import mongoose, { model } from "mongoose";


const blogSchema = new mongoose.Schema({

    title : {type: String, required: true},
    subTitle : {type: String},
    description : {type: String, required: true},
    category : {type: String, required: true},
    image : {type: String, required: true}, //we are storing the url of image so type will be string
    isPublished : {type: Boolean, required: true},
},{timestamps: true});

// we have created above schema and using this schema we create the below model

const Blog = mongoose.model('blog', blogSchema); // here blog is the collection name in our database and blogSchema is the schema we created above

export default Blog;