import mongoose, { connect } from "mongoose";


// function to connect the backend with database. in server.js we call this function
const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log("Database connected"))
        await mongoose.connect(`${process.env.MONGODB_URI}/quickblog`)
    } catch (error) {
        console.log(error.message); 
    }
}

export default connectDB;
