import express from "express";
import { authMiddleware } from "../middlewares/middleware";
const router = express.Router();



router.post("/",authMiddleware,(req,res)=>{
    console.log("create a zap")
})

router.get("/",authMiddleware,(req,res)=>{
    console.log("zap handler");
})

router.get("/:zapId",authMiddleware,(req,res)=>{
    console.log("get a zap");
})



export default router;
