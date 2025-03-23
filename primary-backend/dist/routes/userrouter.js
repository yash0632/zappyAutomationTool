"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../middlewares/middleware");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = express_1.default.Router();
router.post("/signup", (req, res) => {
    res.send("signup handler");
});
router.post("/signin", (req, res) => {
    res.send("signin handler");
});
router.get("/user", middleware_1.authMiddleware, (req, res) => {
    console.log(req.user);
    res.send(req.user);
});
exports.default = router;
