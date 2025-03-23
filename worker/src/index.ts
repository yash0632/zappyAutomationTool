import {PrismaClient} from "@prisma/client";
import {Kafka} from "kafkajs";
const client = new PrismaClient();

const TOPIC_NAME = 'zap-events';

const kafka = new Kafka({
    brokers:['localhost:9092'],
    enforceRequestTimeout:true
})

const consumer = kafka.consumer({groupId:"main-worker"});


async function connectConsumer(){
    await consumer.connect();
    await consumer.subscribe({
        topic:TOPIC_NAME, 
        fromBeginning:true
    })
}


async function processZapRun(zapRunId:string){
    const zapRunDbData = await client.zapRun.findUnique({
        where:{
            id:zapRunId
        }
    })

    if(!zapRunDbData){
        return;
    }
    const zapId = zapRunDbData.zapId;
    const zap = await client.zap.findUnique({
        where:{
            id:zapId
        },
        include:{
            trigger:{
                include:{
                    triggerType:true
                }
            },
            actions:{
                include:{
                    actionType:true
                }
            }
        }
    })

    const metadata = zapRunDbData.metadata;
    

    if(!zap){
        return;
    }

    const trigger = zap.trigger;
    const actions = zap.actions;

    actions.sort((a,b)=>{
        if(a.sortingOrder < b.sortingOrder){
            return -1;
        }
        else{
            return 1;
        }
    })

    const triggerData = {
        id:trigger?.id,
        name:trigger?.triggerType?.name,
        typeId:trigger?.triggerType?.id
    }

    const actionDataArray = actions.map(action=>{
        return{
            id:action?.id,
            name:action?.actionType?.name,
            typeId:action?.actionType?.id
        }
    })

    const zapRunData = {
        id:zapRunId,
        metadata,
        trigger:triggerData,
        actions:actionDataArray
    }

}


async function main(){
    await connectConsumer();

    await consumer.run({
        autoCommit:false,
        eachMessage: async({topic,partition,message,heartbeat})=>{
            if(!message.value){
                return;
            }
            const zapRunId = JSON.parse(message.value.toString());

            await processZapRun(zapRunId);
            
            consumer.commitOffsets([
                {
                    topic:TOPIC_NAME,
                    partition:partition,
                    offset:(parseInt(message.offset) + 1).toString() 
                }
            ])
            
        }
    })
}
main();

// function signOut(){
//     setTimeout(async()=>{
//         await consumer.disconnect();
//         process.exit(0);
//     },2000);
// }
// signOut();