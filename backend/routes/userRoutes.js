import express from "express"
//controllers
import {createUser , getAllUsers, getCurrUser, loginUser, logoutUser, updateCurrUser} from "../controllers/userController.js"
import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js"

//middlewares

const router = express.Router()

router.route("/").post(createUser).get(authenticate , authorizeAdmin , getAllUsers)
router.route("/auth").post(loginUser)
router.route("/logout").post(logoutUser)
router.route("/profile").get(authenticate,getCurrUser).put(authenticate,updateCurrUser)

export default router