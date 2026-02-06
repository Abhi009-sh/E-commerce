class ApiError extends Error {
   constructor(message='Internal server error'
    ,statusCode,
    errors=[],
    stack='',){
        super(message);
        this.stausCode=statusCode;
        this.errors=errors;
        this.stack=stack;
        this.success=false;
        this.data=null;
        if(stack){
            this.stack=stack;
        }else{
            Error.captureStackTrace(this,this.constructor);
        }

    }




}
export {ApiError};