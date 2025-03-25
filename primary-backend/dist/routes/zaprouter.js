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
router.use(express_1.default.json());
router.post("/", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userEmail = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
        if (!userEmail) {
            res.status(401).json({
                message: "Unauthorized"
            });
            return;
        }
        const userId = yield prisma.user.findUnique({
            where: {
                email: userEmail
            },
            select: {
                id: true
            }
        });
        if (!userId) {
            res.status(401).json({
                message: "Unauthorized"
            });
            return;
        }
        const response = zaptype_1.ZapCreateSchema.safeParse(req.body);
        if (response.error) {
            res.status(400).json({
                message: "Input Schema is not Valid",
                error: response.error
            });
            return;
        }
        const { availableTriggerId, triggerMetadata, actions } = response.data;
        //Create a trigger
        //Create actions
        const zap = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const zap = yield tx.zap.create({
                data: {
                    userId: userId.id
                }
            });
            const triggerTable = yield tx.trigger.create({
                data: {
                    triggerTypeId: availableTriggerId,
                    triggerMetadata: triggerMetadata,
                    zapId: zap.id
                }
            });
            const actionTable = yield tx.action.createMany({
                data: actions.map(action => {
                    return {
                        actionTypeId: action.availableActionId,
                        actionMetadata: action.actionMetadata,
                        zapId: zap.id,
                        sortingOrder: action.sortingOrder
                    };
                })
            });
            return zap;
        }));
        res.json({
            message: "Zap Created Successfully",
            zap: zap
        });
        return;
    }
    catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error
        });
        return;
    }
}));
router.get("/", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    //Get all the wraps for the user
    try {
        const userEmail = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
        if (!userEmail) {
            res.status(401).json({
                message: "Unauthorized"
            });
            return;
        }
        const userId = yield prisma.user.findUnique({
            where: {
                email: userEmail
            },
            select: {
                id: true
            }
        });
        if (!userId) {
            res.status(401).json({
                message: "Unauthorized"
            });
            return;
        }
        const zaps = yield prisma.zap.findMany({
            where: {
                userId: userId.id
            },
            include: {
                actions: {
                    include: {
                        actionType: {
                            select: {
                                name: true
                            }
                        }
                    }
                },
                trigger: {
                    include: {
                        triggerType: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        });
        res.status(200).json({
            message: "Zaps fetched successfully",
            zaps: zaps
        });
        return;
    }
    catch (error) {
        res.status(500).json({
            message: "Internal Server Error"
        });
        return;
    }
}));
router.get("/:zapId", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    //Get a zap by id
    try {
        const zapParamsId = req.params.zapId;
        const userId = yield prisma.user.findUnique({
            where: {
                email: (_a = req.user) === null || _a === void 0 ? void 0 : _a.email
            },
            select: {
                id: true
            }
        });
        if (!userId) {
            res.status(401).json({
                message: "Unauthorized"
            });
            return;
        }
        const zap = yield prisma.zap.findUnique({
            where: {
                id: zapParamsId,
                userId: userId.id
            },
            include: {
                actions: {
                    include: {
                        actionType: {
                            select: {
                                name: true
                            }
                        }
                    }
                },
                trigger: {
                    include: {
                        triggerType: {
                            select: {
                                name: true
                            }
                        }
                    }
                }
            }
        });
        if (!zap) {
            res.status(404).json({
                message: "Zap not found"
            });
            return;
        }
        res.status(200).json({
            message: "Zap fetched successfully",
            zap: zap
        });
        return;
    }
    catch (error) {
        res.status(500).json({
            message: "Internal Server Error"
        });
        return;
    }
}));
exports.default = router;
