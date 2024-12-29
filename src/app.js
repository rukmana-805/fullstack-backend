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

export {app}