"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZapCreateSchema = void 0;
const zod_1 = require("zod");
exports.ZapCreateSchema = zod_1.z.object({
    availableTriggerId: zod_1.z.string(),
    triggerMetadata: zod_1.z.any().optional(),
    actions: zod_1.z.array(zod_1.z.object({
        availableActionId: zod_1.z.string(),
        actionMetadata: zod_1.z.any().optional(),
        sortingOrder: zod_1.z.number()
    }))
});
