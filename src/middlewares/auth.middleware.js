import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

/*
-> Ye req mai cookie ka access kanha se aya ?
jab frontend mai user ne logout ko click hua hoga toh ek logout req ayega though fetch method like

await fetch("/api/v1/user/logout", {
  method: "POST",
  credentials: "include", // <-- important -> Ye spacify karta hai ki cookies ka data iss req ke sath aye
                                kyun ki cookies browser mai store hain, hamne responce bheja tha jo
});


-> Aab verify kya karta hai ?
jwt.verify() check karta hai:
Kya ye signature sahi hai?
Is token really issued by us? (using the secret key ACCESS_TOKEN_SECRET)
Agar token ko kisi ne modify kiya ho, ya fake banaya ho, toh verify fail ho jaata hai ❌

jwt.verify() also checks:
Kya token abhi valid hai?
Agar expire ho gaya, toh error throw karta hai:

-> Ye decoded token bhi deta hai, kyun ki yanha jo token hai woh encripted hai toh use decode ka kam bhi karta 
hai niche jo dikh raha hai

-> Agar sab kuch sahi hai, ye return karta hai:
{
  _id: "64asf23423sdf",    // user ID  -> This how we get the user which we want to logout
  iat: 1718080000,         // issued at (timestamp)
  exp: 1718080900          // expires at (timestamp)
}


Aab sawal ye hai ki req.user mai user kanha se aya
ans : user kanhi se bhi nhi aya hai, ham add kar rahe hain ye user ko req mai
req.user = user -> is code se, ye javascript ka syntex hai add karne ke liye

why -> ye ham add kar rahe hain taki jab iss middleware ke baad logoutUser function calega toh uske req mai user 
available ho

--> Aab iske badd samajhne ke liye aap user.controller ke logout function mai jayen wanha req mai user 
hoga aapke paas then aap user ka id access kar sakte hain aur user find kar sakte hain jisko  logout karna hai
*/

export const verifyJWT = asyncHandler(async (req, resp, next) => {
    
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    
        if(!token){
            throw new ApiError(401, "Unauthorized request")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if(!user){
            throw new ApiError(401, "Invalid Access Token")
        }
    
        req.user = user; // Updating the user 
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid Access Token")
    }
})