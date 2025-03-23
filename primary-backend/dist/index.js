"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const zaprouter_1 = __importDefault(require("./routes/zaprouter"));
const userrouter_1 = __importDefault(require("./routes/userrouter"));
app.use('/api/v1/zap', zaprouter_1.default);
app.use('/api/v1/user', userrouter_1.default);
app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
