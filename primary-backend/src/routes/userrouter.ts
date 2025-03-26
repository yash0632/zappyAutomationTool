import express, { Request, Response } from "express";
import { authMiddleware } from "../middlewares/middleware";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { SignUpSchema,SignInSchema } from "../types/usertype";
import { ResponseStatus } from "../types/responsestatus";

const prisma = new PrismaClient();

router.use(express.json());


router.post("/signup", async(req: Request, res: Response) => {
  try{ 
      const response = SignUpSchema.safeParse(req.body);
      if(!response.success){
        res.status(400).json({
          message:"Input Schema is not Valid",
          error:response.error.issues[0].message
        })
        return;
      }
      const {username,password,email} = response.data;
      const user  = await prisma.user.findUnique({
        where:{
          email:email
        }
      })
      if(user != null){
        res.status(403).json({
          message:`Email: ${email} is already present`
        })
        return;
      }

      const hashPassword = bcrypt.hashSync(password,10).toString();
      await prisma.user.create({
        data:{
          name:username,
          password:hashPassword,
          email:email
        }
      })
      const token = jwt.sign({email},process.env.JWT_SECRET as string,{expiresIn:"24h"})
      res.json({
        message:"success",
        token:token
      })
  }
  catch(error){
    res.status(500).json({
      message:"Error in user creation",
      metadata:{
        'userdata':req.body,
        error:error
      }
    })
  }
});

router.post("/login",async (req: Request, res: Response) => {
  try{
    const response = SignInSchema.safeParse(req.body);
    if(response.error){
      res.status(400).json({
        message:"Input Schema is not valid",
        error:response.error.issues[0].message
      })
      return;
    }

    const {email,password} = response.data;
    const user = await prisma.user.findUnique({
      where:{
        email:email
      }
    })
    if(user == null){
      res.status(404).json({
        message:"Email is not Present"
      })
      return;
    }
    const dbPassword = user.password;
    const match = await bcrypt.compare(password,dbPassword);
    if(!match){
      res.status(ResponseStatus.FORBIDDEN).json({
        message:"Password is not correct"
      })
      return;
    }

    const token = jwt.sign({email},process.env.JWT_SECRET as string,{expiresIn:"24h"});
    res.status(ResponseStatus.OK).json({
      message:"Signed In Successfully!",
      token:token
    })
    return;

  }
  catch(error){
    res.status(500).json({
      message:"Error in user creation",
      metadata:{
        'userdata':req.body,
        error:error
      }
    })
    return;
  }
});

router.get("/",authMiddleware,async (req: Request, res: Response) => {
  
  try{
    const email = req.user?.email;
    const userData = await prisma.user.findUnique({
      where:{
        email
      }
    })
    if(userData == null){
      res.status(ResponseStatus.INTERNAL_SERVER_ERROR).json({
        message:"email not find on database by is jwt authenticated",
        error:req
      })
      return;
    }

    res.status(ResponseStatus.OK).json({
      name:userData.name,
      email:userData.email
    })
    return;

  }
  catch(error){
    res.status(500).json({
      message:"Error in user creation",
      metadata:{
        'userdata':req.body,
        error:error
      }
    })
    return;
  }
});

export default router;
