"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../middlewares/middleware");
const router = express_1.default.Router();
const zaptype_1 = require("../types/zaptype");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
router.post("/", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = zaptype_1.ZapCreateSchema.safeParse(req.body);
    if (!response.success) {
        res.status(400).json({
            message: "Input Schema is not Valid",
            error: response.error.issues[0].message
        });
        return;
    }
    const { availableTriggerId, triggerMetadata, actions } = response.data;
    res.json({
        message: "working"
    });
    return;
}));
router.get("/", middleware_1.authMiddleware, (req, res) => {
    console.log("zap handler");
});
router.get("/:zapId", middleware_1.authMiddleware, (req, res) => {
    console.log("get a zap");
});
exports.default = router;
