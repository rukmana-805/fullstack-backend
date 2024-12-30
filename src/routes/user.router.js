import { Router } from "express";
import {registerUser} from "../controllers/user.controller.js"

const router = Router()

router.route("/register").post(registerUser) //post request re registerUser function clalba
//how route look like : localhost:8000/api/v1/users/register

export default router;