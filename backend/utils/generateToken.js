import jwt from 'jsonwebtoken'

const generateToken = (res,next)=>{
    const token = jwt.sign({userId},process.env.JWT_SECRET,{expiresIn : "30d"})

    //set the jwt as an http only cookie
    res.cookie("jwt",token,{
        httpOnly : true,
        secure : process.env.NODE_ENV !== "development",
        samesite : StrictMode,
        maxAge : 30 * 24 * 60 * 60 * 1000

    })
    return token
}

export default generateToken