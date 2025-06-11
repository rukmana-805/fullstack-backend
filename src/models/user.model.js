import mongoose, {Schema} from "mongoose";

import jwt from "jsonwebtoken";

//Used for encription
import bcrypt from "bcrypt";

const userSchema = new Schema({
    username : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
        index : true //Use for searching(Whenever searching ou want then you use index as true)
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
    },
    fullname : {
        type : String,
        required : true,
        trim : true,
        index : true
    },
    avatar : {
        type : String, // cloudinary url
        required : true,
    },
    coverImage : {
        type : String,
    },
    watchHistory : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Video"
        }
    ],
    password : {
        type : String, //encripted String
        required : [true, "Password is required"]
    },
    refreshToken : {
        type : String
    }
}, {timestamps : true}) //timestamp for created at and updated at


//pre is a middle where it say before save means saving data this will run-> what it do-> just encript the password
userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();// if password not modified to to next but if modified then again hash it

    this.password = await bcrypt.hash(this.password, 10)//this encript the user password
    next()
})
//This save method already present in the mongoose there are other method also check it out on the website
//and we can create our own methods also usinging "methods" like below code

//Creating your own methods( Like "save" on the above code)
userSchema.methods.isPasswordCorrect = async function (password) {

    return await bcrypt.compare(password, this.password)//compare method compare the password and the encripted password 
    //return true if it is same otherwise return false

}


userSchema.methods.generateAccessToken = function() {

    return jwt.sign( //Sing method is used to generate Access Token
        {
            _id : this._id,
            email : this.email,
            username : this.username,
            fullname : this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : process.env.ACCESS_TOKEN_EXPIRY
        }
    )

}


userSchema.methods.generateRefreshToken = function() {

    return jwt.sign( //Sing method is used to generate Access Token
        {
            _id : this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : process.env.REFRESH_TOKEN_EXPIRY
        }
    )

}

export const User = mongoose.model("User",userSchema)