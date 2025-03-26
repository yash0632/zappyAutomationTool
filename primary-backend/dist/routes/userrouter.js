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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = express_1.default.Router();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const client_1 = require("@prisma/client");
const usertype_1 = require("../types/usertype");
const responsestatus_1 = require("../types/responsestatus");
const prisma = new client_1.PrismaClient();
router.use(express_1.default.json());
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = usertype_1.SignUpSchema.safeParse(req.body);
        if (!response.success) {
            res.status(400).json({
                message: "Input Schema is not Valid",
                error: response.error.issues[0].message
            });
            return;
        }
        const { username, password, email } = response.data;
        const user = yield prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (user != null) {
            res.status(403).json({
                message: `Email: ${email} is already present`
            });
            return;
        }
        const hashPassword = bcryptjs_1.default.hashSync(password, 10).toString();
        yield prisma.user.create({
            data: {
                name: username,
                password: hashPassword,
                email: email
            }
        });
        const token = jsonwebtoken_1.default.sign({ email }, process.env.JWT_SECRET, { expiresIn: "24h" });
        res.json({
            message: "success",
            token: token
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error in user creation",
            metadata: {
                'userdata': req.body,
                error: error
            }
        });
    }
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = usertype_1.SignInSchema.safeParse(req.body);
        if (response.error) {
            res.status(400).json({
                message: "Input Schema is not valid",
                error: response.error.issues[0].message
            });
            return;
        }
        const { email, password } = response.data;
        const user = yield prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (user == null) {
            res.status(404).json({
                message: "Email is not Present"
            });
            return;
        }
        const dbPassword = user.password;
        const match = yield bcryptjs_1.default.compare(password, dbPassword);
        if (!match) {
            res.status(responsestatus_1.ResponseStatus.FORBIDDEN).json({
                message: "Password is not correct"
            });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ email }, process.env.JWT_SECRET, { expiresIn: "24h" });
        res.status(responsestatus_1.ResponseStatus.OK).json({
            message: "Signed In Successfully!",
            token: token
        });
        return;
    }
    catch (error) {
        res.status(500).json({
            message: "Error in user creation",
            metadata: {
                'userdata': req.body,
                error: error
            }
        });
        return;
    }
}));
router.get("/", middleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const email = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
        const userData = yield prisma.user.findUnique({
            where: {
                email
            }
        });
        if (userData == null) {
            res.status(responsestatus_1.ResponseStatus.INTERNAL_SERVER_ERROR).json({
                message: "email not find on database by is jwt authenticated",
                error: req
            });
            return;
        }
        res.status(responsestatus_1.ResponseStatus.OK).json({
            name: userData.name,
            email: userData.email
        });
        return;
    }
    catch (error) {
        res.status(500).json({
            message: "Error in user creation",
            metadata: {
                'userdata': req.body,
                error: error
            }
        });
        return;
    }
}));
exports.default = router;
