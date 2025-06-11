import { Router } from "express";
import {loginUser, logoutUser, refreshAccessToken, registerUser} from "../controllers/user.controller.js"

import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

//inject middleware upload before registering the user
router.route("/register").post(
    upload.fields([ //fields takes an array
        {
            name : "avatar",
            maxCount : 1
        },
        {
            name : "coverImage",
            maxCount : 1
        }
    ]) ,
    registerUser
) 
//post request re registerUser function clalba
//how route look like : localhost:8000/api/v1/users/register

router.route("/login").post(loginUser)


// Secure Routes
router.route("/logout").post(verifyJWT, logoutUser) // use middleware verifyJWT then next() is logoutUser -> This is how middleware works
router.route("/refresh-token").post(refreshAccessToken)

export default router;