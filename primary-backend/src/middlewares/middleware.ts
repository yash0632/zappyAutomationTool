import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
declare global {
    namespace Express {
        interface Request {
            user?: {
                email:string
            };
        }
    }
}
dotenv.config();

export const authMiddleware =(req:Request,res:Response,next:NextFunction)=>{
    try{
        const token = req.headers.authorization?.split(" ")[1];
        if(!token){
            res.status(401).json({
                message:"Unauthorized",
                error:"Token is not present"
            })
            return;
        }
        const decoded= jwt.verify(token,process.env.JWT_SECRET as string) as {email:string};
        req.user = decoded;
        next();
    }
    catch(error){
        res.status(401).json({
            message:"Unauthorized",
            error:error
        })
        return;
    }
}