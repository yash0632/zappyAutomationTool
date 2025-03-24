import express from "express";
import { authMiddleware } from "../middlewares/middleware";
const router = express.Router();
import {ZapCreateSchema} from "../types/zaptype";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


router.post("/",authMiddleware,async(req,res)=>{
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
            data:{}
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
        zap
    })
    return;
    
})

router.get("/",authMiddleware,(req,res)=>{
    console.log("zap handler");
})

router.get("/:zapId",authMiddleware,(req,res)=>{
    console.log("get a zap");
})



export default router;
