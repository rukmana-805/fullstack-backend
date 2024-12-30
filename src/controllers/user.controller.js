//asyncHandler is the error wrapper that take a function inside and if there is an error it resolve it
import {asyncHandler} from "../utils/asyncHandler.js"

const registerUser = asyncHandler( async (req, resp) => {
    resp.status(200).json({
        message : "ok"
    })
})


export {registerUser}