import { HDNodeWallet } from 'ethers'
import { BaseMemory } from '../memory';
import redis from "../../utils/redis";
import { randomUUID } from "crypto";
interface GOAL {summary:string,description:string,startData:string,endDate?: string,tasks?:string[]};
export async function createGoal({summary,description,startData,endDate,tasks}: GOAL) {
    const id =  randomUUID();
    if(await redis.get(`goal:${id}`)){return;};
    await redis.set(`goal:${id}:summary`,summary || "");
    await redis.set(`goal:${id}:description`, description || "");
    await redis.set(`goal:${id}:startDate`, startData || new Date().toISOString().slice(0,16));
    await redis.set(`goal:${id}:endDate`, startData || new Date().toISOString().slice(0,16));
    // if (tasks && tasks){
    //     await Promise.all(tasks.map(async(task)=>{
    //         await redis.set(`task:${task}:id`, id);
    //         return;
    //     }));
    // }
    await redis.set(`goal:${id}:description`, description || "");
    return {id,summary,description,startData,endDate,tasks};
}