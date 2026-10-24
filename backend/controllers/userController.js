import asyncHandler from "../middlewares/asyncHandler.js"
import bcrypt from "bcryptjs"
import generateToken from "../utils/generateToken.js"
import User from "../models/user.js"
const createUser = asyncHandler(async (req,res)=>{
    const {username,email,password} = req.body
    if(!username || !email || !password){
        throw new Error("please fill all the fields")
    }
    try{
        const userExists = await User.findOne({email})
        if(userExists){
            res.status(400).send("user already exists")
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)
        const newUser = new User({
            username , email ,password : hashedPassword 
        })
        try{
            await newUser.save()
            generateToken(res,newUser._id)
            res.status(201).json({
                _id : newUser._id,
                username : newUser.username,
                email : newUser.email,
                isAdmin : newUser.isAdmin
            })
            


        }catch(err){
            res.status(400)
            console.log(err.message)
            throw new Error("invalid data")
            

        }

    }catch(err){
        res.status(400)
        console.log(err.message)
        throw new Error("invalid data")  
    }
    
})

const loginUser = asyncHandler(async (req,res)=>{
    const {email , password} = req.body
    const existingUser = await User.findOne({email})
    if(existingUser){
        //check the password
        const isPasswordValid = await bcrypt.compare(password,existingUser.password)
        if(isPasswordValid){
            generateToken(res,existingUser._id)
            res.status(200).json({
                _id: existingUser._id,
                username: existingUser.username,
                email: existingUser.email,
                isAdmin: existingUser.isAdmin,
            })


        }
        else{
             res.status(401).json({ message: "Invalid Password"});
        }
    }
    else{
        res.status(401).json({ message: "User not found" });
    }
})

const logoutUser = asyncHandler(async(req,res)=>{
    res.cookie("jwt","",{
        httpOnly : true,
        expires : new Date(0)
    })

    res.status(200).send("logged out successfully")
})

const getAllUsers = asyncHandler(async(req,res)=>{
    const users = await User.find({}).select("-password")
    res.json(users)
})

const getCurrUser = asyncHandler(async(req,res)=>{
    const currUser = await User.findById(req.user._id)
    if(currUser){
       res.status(200).json({
        _id: currUser._id,
        username: currUser.username,
        email: currUser.email,
        isAdmin: currUser.isAdmin,
    });

    }else{
        res.status(404).send("user not found")
    }
})

const updateCurrUser = asyncHandler(async(req,res)=>{
    const currUser = await User.findById(req.user._id)
    if(currUser){
    currUser.email = req.body.email || currUser.email
    currUser.username = req.body.username || currUser.username
    if(req.body.password){
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password,salt)
        currUser.password = hashedPassword
    }
    const updatedUser = await currUser.save();
    res.status(200).json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
    });
}else{
    res.status(404)
    throw new Error("User not found")
}
})

export { createUser , loginUser , logoutUser , getAllUsers ,getCurrUser , updateCurrUser }