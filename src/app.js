import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin : process.env.CORS_ORIGIN,// from where you can access our backend
    credentials : true
}))

//Configurations
app.use(express.json({limit:"16kb"}))// This line says that we can accept the json data( limit specify you can only send 16kb of json data)
app.use(express.urlencoded({limit : "16kb"})) //This specify that we can allow url coversion like + is %20 etc
app.use(express.static("public")) //It says that whatever static file like pdf, images etc should be allowed to my public folder

app.use(cookieParser()) //we allow cookies and perform crud operation on these cookies


//routes import
import userRouter from "./routes/user.router.js";


//router declaration
app.use("/api/v1/users", userRouter); //whenever someone click /user route it gives control to userRouter

//how route look like : localhost:8000/api/v1/users

export {app}