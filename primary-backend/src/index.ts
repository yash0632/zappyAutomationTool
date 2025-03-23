import express from "express";
import cors from "cors";
const app = express();
app.use(cors());

import zapRouter from "./routes/zaprouter";
import userRouter from "./routes/userrouter";
app.use('/api/v1/zap',zapRouter);
app.use('/api/v1/user',userRouter);
app.listen(3001,()=>{
    console.log("Server is running on port 3001");
})
