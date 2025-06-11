//asyncHandler is the error wrapper that take a function inside and if there is an error it resolve it
import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponce.js";
import jwt from "jsonwebtoken";


//Function that create refresh and access token
const generateAccessAndRfreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        //Updating refresh Token to the user after generating it
        user.refreshToken = refreshToken
        //saving into database
        await user.save({validateBeforeSave:false}) //validateBeforeSave this field doesn,t asked for validation while updating refresh token in database

        return {accessToken, refreshToken};

    } catch (error) {
        throw new ApiError(500, "Somthing went wrong while creating Refresh and Access Token")
    }
}

const registerUser = asyncHandler( async (req, resp) => {
    //get user details from frontend
    //validation - not empty
    //check user already exist - through username & email
    //check for images, check for avtar
    //upload them to coludinary, avtar
    //create user object - create entry in db
    //remove password & refrest token field from responce
    //check for user creation
    //return responce

    //validation
    const {fullname, email, username, password} = req.body
    if(
        [fullname, email, username, password].some((field) => field?.trim() === "" )//some method apply on every fields wherther it empty or not and return boolean value
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or : [{ username }, { email }] //by the basis of usename and password it check they re exist or not
    })

    if(existedUser){
        throw new ApiError(409, "User with email or usernamr already exists")
    }

    //for files
    console.log("Files : ",req.files);
    const avatarLocalPath = req.files?.avatar[0]?.path;
    //const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    //console.log(avatarLocalPath);

    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar image is required");
    }
    // if(!coverImageLocalPath) {
    //     throw new ApiError(400, "Cover image is required");
    // }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    //console.log(avatar);

    if(!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }

    //For database upload we create an user
    const user = await User.create({
        fullname,
        avatar : avatar.url,
        coverImage : coverImage?.url || "",//if cover image not present then it should be empty(coverImage->optinal)
        email,
        password,
        username : username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken" //It will remove the password and refereshToken from the user
    )

    if(!createdUser){
        throw new ApiError(500, "Somthing went wrong while reistering the user")
    }

    return resp.status(201).json(
        new ApiResponse(200, createdUser, "User Register Successfully")
    )
})

const loginUser = asyncHandler(async (req, resp) => {

    //Algorithm
    //req.body -> data
    //username or email use
    //find user present or not
    //password check
    //give access and refresh token
    //send cookie

    const {email, username, password} = req.body;
    if(!username && !email){
        throw new ApiError(400, "username or password");
    }

    const user = await User.findOne({
        $or:[{username},{ email}]
    })


    if(!user){
        throw new ApiError(404, "User doesn't exist")
    }

    //diff between user and User(User contains mongoose function like findOne etc but user contain own created menthid like isPasswordValid)
    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        throw new ApiError(401, "Invalid Password")
    }

    const {accessToken, refreshToken} = await generateAccessAndRfreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    //cookies

    const options = {
        httpOnly : true, //If we made these two fields true then the cookies doesn't modified through frontend and
        secure : true    // can be modified only throgh server
    }

    return resp.
    status(200).
    cookie("accessToken",accessToken, options).
    cookie("refreshToken",refreshToken, options).
    json(
        new ApiResponse(
            200,
            {
                user : loggedInUser, accessToken, refreshToken
            },
            "User LogedIn Successfully"
        )
    ) 
})

/* 
--> jwtVerify middleware chalne ke baad hame req mai object mil jayega
aab ham user ke id se user ko fetch karenge aur user ke 
refreshToken(Jo der tak rehta hai) ko undefined kar denge iska mtlb refreshToken database mai undefined
ho jayega mtlb logout ho gya !!

--> Aab logout karne ke baad cookies ko bhi toh clear karna padega, that is why we clear the cookies also
*/
const logoutUser = asyncHandler(async (req, resp) => {
    await User.findByIdAndUpdate(
        req.user._id, // This we got from updation the user in verifyJWT middleware which run before logoutUser
        {
            $set : {
                refreshToken : undefined
            }
        },
        {
            new : true //For updated refreshToken : undefined
        }
    )

    const options = {
        httpOnly:true,
        secure:true
    }

    return resp.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})


const refreshAccessToken = asyncHandler(async (req, resp) => {

    const incommingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if(!incommingRefreshToken){
        throw new ApiError(401, "Unauthorized Access")
    }

    try {//This try catch optional
        const decodedToken = jwt.verify(incommingRefreshToken, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id)
    
        if(!user){
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if(incommingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, "Refresh token is expired or used")
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRfreshTokens(user._id)
        return resp.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    accessToken, refreshToken: newRefreshToken
                },
                "Access Token Refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Refresh Token")
    }

})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
}