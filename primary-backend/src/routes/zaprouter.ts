import express from "express";
import { authMiddleware } from "../middlewares/middleware";
const router = express.Router();
import {ZapCreateSchema} from "../types/zaptype";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
router.use(express.json());


router.post("/",authMiddleware,async(req,res)=>{
   try{
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
        if(response.error){
            res.status(400).json({
                message:"Input Schema is not Valid",
                error:response.error
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
    }
    catch(error){
        res.status(500).json({
            message:"Internal Server Error",
            error:error
        })
        return;
    }
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
        const userId =await prisma.user.findUnique({
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
        const zaps = await prisma.zap.findMany({
            where:{
                userId:userId.id
            },
            include:{
                actions:{
                    include:{
                        actionType:{
                            select:{
                                name:true
                            }
                        }
                    }
                },
                trigger:{
                    include:{
                        triggerType:{
                            select:{
                                name:true
                            }
                        }
                    }
                }
            }
        })
        
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
        const userId = await prisma.user.findUnique({
            where:{
                email:req.user?.email
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
        const zap =await prisma.zap.findUnique({
            where:{
                id:zapParamsId,
                userId:userId.id
            },
            include:{
                actions:{
                    include:{
                        actionType:{
                            select:{
                                name:true
                            }
                        }
                    }
                },
                trigger:{
                    include:{
                        triggerType:{
                            select:{
                                name:true
                            }
                        }
                    }
                }
            }
        })
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
