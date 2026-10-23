import jwt from 'jsonwebtoken'
import User from '../models/user'
import asyncHandler from './asyncHandler'

//check whether the user is authenticated or not

const authenticate = asyncHandler(async(req,res,next)=>{
    let token;
    token = req.cookies.jwt
    if(token)
        try{
        
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        req.user = await User.findById(decoded.userId).select("-password")
        next()


    }catch(err){
        res.status(401)
        throw new Error("Not authenticated, token failed")

    }
    else{
        res.status(401)
        throw new Error("Not authenticated, no token")
    }
})

const authorizeAdmin = (req,res,next)=>{
    if(req.user && req.user.userId){
        next()
    }
    else {
    res.status(401).send("Not authorized as an admin");
  }
}

export {authenticate , authorizeAdmin}