import { PrismaClient } from "@prisma/client"
import {Kafka} from "kafkajs"

const client = new PrismaClient()

const TOPIC_NAME = 'zap-events';

const kafka = new Kafka({
    clientId: 'outbox-processor',
    brokers: ['localhost:9092'],
    enforceRequestTimeout:true
})
const producer = kafka.producer({
    allowAutoTopicCreation: false,
    transactionTimeout:30000
});

async function connectKafkaProducer(){
    
    await producer.connect();

}

;
async function main(){
    await connectKafkaProducer();
    for(let i = 0;i < 1;i++){
        //What to do?
        //1. Get Pending ZapRuns from outBox
        const pendingZapRuns = await client.zapRunOutbox.findMany({
            where:{},
            take:10
        })
        //2. Send pending ZapRuns to Kafka
        await producer.send({
            topic:TOPIC_NAME,
            messages:pendingZapRuns.map(zapRunOutboxData=>({
                value:JSON.stringify(zapRunOutboxData.zapRunId)
            }))
        })
        
        //3. Delete processed ZapRuns from outBox
        // await client.zapRunOutbox.deleteMany({
        //     where:{
        //         id:{
        //             in:pendingZapRuns.map(zapRunOutboxData=>{
        //                 return zapRunOutboxData.id;
        //             })
        //         }
        //     }
        // })
    }
}

main().catch(async(e)=>{
    console.log(e);
    await producer.disconnect();
    process.exit(1);
})