
//Whatever error that we have passed thit should be organised like this, every error have these variable that shows

class ApiError extends Error{

    constructor(
        statusCode,
        message = "Somthing went wrong",
        errors = [],
        stack = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false // breause it is error 
        this.errors = errors

        if(stack) {
            this.stack = stack
        }else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export {ApiError}