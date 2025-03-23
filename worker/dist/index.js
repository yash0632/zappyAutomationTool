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
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const kafkajs_1 = require("kafkajs");
const client = new client_1.PrismaClient();
const TOPIC_NAME = 'zap-events';
const kafka = new kafkajs_1.Kafka({
    brokers: ['localhost:9092'],
    enforceRequestTimeout: true
});
const consumer = kafka.consumer({ groupId: "main-worker" });
function connectConsumer() {
    return __awaiter(this, void 0, void 0, function* () {
        yield consumer.connect();
        yield consumer.subscribe({
            topic: TOPIC_NAME,
            fromBeginning: true
        });
    });
}
function processZapRun(zapRunId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const zapRunDbData = yield client.zapRun.findUnique({
            where: {
                id: zapRunId
            }
        });
        if (!zapRunDbData) {
            return;
        }
        const zapId = zapRunDbData.zapId;
        const zap = yield client.zap.findUnique({
            where: {
                id: zapId
            },
            include: {
                trigger: {
                    include: {
                        triggerType: true
                    }
                },
                actions: {
                    include: {
                        actionType: true
                    }
                }
            }
        });
        const metadata = zapRunDbData.metadata;
        if (!zap) {
            return;
        }
        const trigger = zap.trigger;
        const actions = zap.actions;
        actions.sort((a, b) => {
            if (a.sortingOrder < b.sortingOrder) {
                return -1;
            }
            else {
                return 1;
            }
        });
        const triggerData = {
            id: trigger === null || trigger === void 0 ? void 0 : trigger.id,
            name: (_a = trigger === null || trigger === void 0 ? void 0 : trigger.triggerType) === null || _a === void 0 ? void 0 : _a.name,
            typeId: (_b = trigger === null || trigger === void 0 ? void 0 : trigger.triggerType) === null || _b === void 0 ? void 0 : _b.id
        };
        const actionDataArray = actions.map(action => {
            var _a, _b;
            return {
                id: action === null || action === void 0 ? void 0 : action.id,
                name: (_a = action === null || action === void 0 ? void 0 : action.actionType) === null || _a === void 0 ? void 0 : _a.name,
                typeId: (_b = action === null || action === void 0 ? void 0 : action.actionType) === null || _b === void 0 ? void 0 : _b.id
            };
        });
        const zapRunData = {
            id: zapRunId,
            metadata,
            trigger: triggerData,
            actions: actionDataArray
        };
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield connectConsumer();
        yield consumer.run({
            autoCommit: false,
            eachMessage: (_a) => __awaiter(this, [_a], void 0, function* ({ topic, partition, message, heartbeat }) {
                if (!message.value) {
                    return;
                }
                //const zapRunId = JSON.parse(message.value.toString());
                //await processZapRun(zapRunId);
                console.log(message.value.toString());
                yield new Promise((resolve) => setTimeout(resolve, 1000));
                console.log("Comitting offset");
                consumer.commitOffsets([
                    {
                        topic: TOPIC_NAME,
                        partition: partition,
                        offset: (parseInt(message.offset) + 1).toString()
                    }
                ]);
            })
        });
    });
}
main();
// function signOut(){
//     setTimeout(async()=>{
//         await consumer.disconnect();
//         process.exit(0);
//     },2000);
// }
// signOut();
