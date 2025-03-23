import express,{Application,Request,Response} from "express"

import { PrismaClient } from "@prisma/client";

const client =new PrismaClient();

const app:Application = express();
app.use(express.json());

const port = process.env.PORT || 3000;

app.post("/hooks/catch/:userId/:zapId",async(req,res)=>{
    const userId = req.params.userId;
    const zapId = req.params.zapId;
    const body = req.body;

    await client.$transaction(async(tx)=>{
        const zapRunData = await tx.zapRun.create({
            data:{
                zapId:zapId,
                metadata:body
            },
            select:{
                id:true
            }
        })

        const zapRunOutboxData = await tx.zapRunOutbox.create({
            data:{
                zapRunId:zapRunData.id
            },
            select:{
                id:true
            }
        })

    })


    
    res.status(200).json({message:"success"});
    
})


app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
})
