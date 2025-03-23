"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../middlewares/middleware");
const router = express_1.default.Router();
router.post("/", middleware_1.authMiddleware, (req, res) => {
    console.log("create a zap");
});
router.get("/", middleware_1.authMiddleware, (req, res) => {
    console.log("zap handler");
});
router.get("/:zapId", middleware_1.authMiddleware, (req, res) => {
    console.log("get a zap");
});
exports.default = router;
