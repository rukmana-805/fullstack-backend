
//asyncHandler function execute requestHandler function that takes req,resp and next parameter
//The asyncHandler function solves this by catching errors and forwarding them to the next middleware (usually an error-handling middleware)
const asyncHandler = (requestHandler) => {

    (req, resp, next) => {
        Promise.resolve(requestHandler(req, resp, next)).
        catch((error) => next(error))
    }

}





// const asyncHandler = () => {}
// const asyncHandler = (func) => { () => {} } //we just remove the brackets
// const asyncHandler = (func) => async () => {}

//Try Catch Method

// const asyncHandler = (fn) => async (req, resp, next) => {

//     try {
//         await fn(req, resp, next)
//     } catch (error) {
//         resp.status(error.code || 500).json({
//             success : false,
//             message : error.message
//         })
//     }

// }