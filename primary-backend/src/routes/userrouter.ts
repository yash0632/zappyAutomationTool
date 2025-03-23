import express, { Request, Response } from "express";
import { authMiddleware } from "../middlewares/middleware";
import dotenv from "dotenv";
dotenv.config();
const router = express.Router();

router.post("/signup", (req: Request, res: Response) => {
  res.send("signup handler");
});

router.post("/signin", (req: Request, res: Response) => {
  res.send("signin handler");
});

router.get("/user",authMiddleware, (req: Request, res: Response) => {
  console.log(req.user);
  res.send(req.user);
});

export default router;
