import express from "express";
import { authMiddleware } from "../middlewares/middleware";
const router = express.Router();
import {ZapCreateSchema} from "../types/zaptype";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


router.post("/",authMiddleware,async(req,res)=>{
    const userEmail = req.user?.email;
    if(!userEmail){
        res.status(401).json({
            message:"Unauthorized"
        })
        return;
    }
    const userId = await prisma.user.findUnique({
        where:{
            email:userEmail
        },
        select:{
            id:true
        }
    })
    if(!userId){
        res.status(401).json({
            message:"Unauthorized"
        })
        return;
    }
    const response = ZapCreateSchema.safeParse(req.body);
    if(!response.success){
        res.status(400).json({
            message:"Input Schema is not Valid",
            error:response.error.issues[0].message
        })
        return;
    }

    const {availableTriggerId,triggerMetadata,actions} = response.data;
    //Create a trigger
    //Create actions

    const zap = await prisma.$transaction(async(tx)=>{
        const zap = await tx.zap.create({
            data:{
                userId:userId.id
            }
        });

        const triggerTable = await tx.trigger.create({
            data:{
                triggerTypeId:availableTriggerId,
                triggerMetadata:triggerMetadata,
                zapId:zap.id
            }
        })
        
        const actionTable = await tx.action.createMany({
            data:actions.map(action=>{
                return{
                    actionTypeId:action.availableActionId,
                    actionMetadata:action.actionMetadata,
                    zapId:zap.id,
                    sortingOrder:action.sortingOrder
                }
            })
        })
        
        return zap;
    })
    

    res.json({
        message:"Zap Created Successfully",
        zap:zap
    })
    return;
    
})

router.get("/",authMiddleware,async(req,res)=>{
    //Get all the wraps for the user
    try{
        const userEmail = req.user?.email;
        if(!userEmail){
            res.status(401).json({
                message:"Unauthorized"
            })
            return;
        }
        const user =await prisma.user.findUnique({
            where:{
                email:userEmail
            },
            include:{
                zaps:true
            }
        })
        if(!user){
            res.status(401).json({
                message:"Unauthorized"
            })
            return;
        }
        const zaps = user.zaps;
        
        res.status(200).json({
            message:"Zaps fetched successfully",
            zaps:zaps
        })
        return;
    }
    catch(error){
        res.status(500).json({
            message:"Internal Server Error"
        })
        return;
    }
})

router.get("/:zapId",authMiddleware,async(req,res)=>{
    //Get a zap by id
    try{
        const zapParamsId = req.params.zapId;
        const user = await prisma.user.findUnique({
            where:{
                email:req.user?.email
            },
            include:{
                zaps:true
            }
        })
        if(!user){
            res.status(401).json({
                message:"Unauthorized"
            })
            return;
        }
        const zap = user.zaps.find(zap=>zap.id===zapParamsId);
        if(!zap){
            res.status(404).json({
                message:"Zap not found"
            })
            return;
        }
        res.status(200).json({
            message:"Zap fetched successfully",
            zap:zap
        })
        return;
    }
    catch(error){
        res.status(500).json({
            message:"Internal Server Error"
        })
        return;
    }
})



export default router;
