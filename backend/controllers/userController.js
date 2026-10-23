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

export { createUser , loginUser }