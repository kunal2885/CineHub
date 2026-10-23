import express from "express"
//controllers
import createUser from "../controllers/userController.js"

//middlewares

const router = express.Router()

router.route("/").post(createUser)

export default router