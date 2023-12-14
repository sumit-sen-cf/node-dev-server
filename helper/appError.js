class appError extends Error{
    constructor(statusCode,message){
        super(message);
        this.statusCode=statusCode;
        this.status=String(statusCode).startsWith('4') ?"failure":"server error";
        this.isOperational=true;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports=appError;