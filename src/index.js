
import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({  //we need to configure the enviroment variable other wise it can't access the .env values
    path : "./env"
})
//the above code is a experimental things so we need to notify in package.json that it is a experimental features
// to do this change -> 

// "scripts": {                               "script" : {
//     "dev": "nodemon src/index.js"     to        "dev" : "nodemon -r dotenv/config --experimental-json-modules index.js"
//   },                                        },


connectDB()
.then(() => {
    app.listen(process.env.PORT || 5000, ()=> {
        console.log(`Server is running at port : ${process.env.PORT}`)
    })
})
.catch((error) => {
    console.log("Mongodb connection error", error)
})