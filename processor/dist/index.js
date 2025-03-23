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
    clientId: 'outbox-processor',
    brokers: ['localhost:9092'],
    enforceRequestTimeout: true
});
const producer = kafka.producer({
    allowAutoTopicCreation: false,
    transactionTimeout: 30000
});
function connectKafkaProducer() {
    return __awaiter(this, void 0, void 0, function* () {
        yield producer.connect();
    });
}
;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield connectKafkaProducer();
        for (let i = 0; i < 1; i++) {
            //What to do?
            //1. Get Pending ZapRuns from outBox
            const pendingZapRuns = yield client.zapRunOutbox.findMany({
                where: {},
                take: 10
            });
            //2. Send pending ZapRuns to Kafka
            yield producer.send({
                topic: TOPIC_NAME,
                messages: pendingZapRuns.map(zapRunOutboxData => ({
                    value: JSON.stringify(zapRunOutboxData.zapRunId)
                }))
            });
            //3. Delete processed ZapRuns from outBox
            // await client.zapRunOutbox.deleteMany({
            //     where:{
            //         id:{
            //             in:pendingZapRuns.map(zapRunOutboxData=>zapRunOutboxData.id)
            //         }
            //     }
            // })
        }
    });
}
main().catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(e);
    yield producer.disconnect();
    process.exit(1);
}));
