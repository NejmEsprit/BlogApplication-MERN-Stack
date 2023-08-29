//Not Found Middleware
const notFound =(req,res,next)=>{
    const err =new Error(`not found -${req.originalUrl}`)
    res.status(404)
    next(err)
}
//Error Handler Middleware
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack
    })
} 
module.exports={
    errorHandler,
    notFound
}