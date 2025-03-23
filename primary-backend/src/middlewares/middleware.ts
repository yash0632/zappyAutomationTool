import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}
dotenv.config();
export const authMiddleware =(req:Request,res:Response,next:NextFunction)=>{
    try{
        const authHeader = req.headers.authorization;
        if(!authHeader){
            return res.status(401).json({message:"Unauthorized"});
        }
        const token = authHeader.split(" ")[1];
        if(!token){
            return res.status(401).json({message:"Unauthorized"});
        }
        
        const decoded = jwt.verify(token,process.env.JWT_SECRET as string);
        req.user = decoded;
        next();
    }
    catch(error){
        return res.status(401).json({message:"Unauthorized"});
    }
}