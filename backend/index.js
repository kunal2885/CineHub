//packages
import express from "express"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import path from "path"
import userRoutes from "./routes/userRoutes.js"

//files
import connectDb from "./config/db.js"
import { urlencoded } from "body-parser"

//configuration
dotenv.config()
connectDb()

const app = express()

//middlewares
app.use(express.json())
app.use(urlencoded({extended : true}))
app.use(cookieParser())

//routes
app.use("/api/v1/users",userRoutes)

const PORT = process.env.PORT || 3000

app.listen(PORT,()=> console.log(`successfully listening to port ${PORT}`))