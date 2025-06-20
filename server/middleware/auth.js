import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
    //we will get the token from the request, we have to pass the request headers with authorization property
    const token = req.headers.authorization;

    try {
        jwt.verify(token, process.env.JWT_SECRET) 
        next(); //if token is verified then it will execute the next function
    } catch (error) {
        res.json({success: false, message: "Invalid token"})
    }
}

export default auth;