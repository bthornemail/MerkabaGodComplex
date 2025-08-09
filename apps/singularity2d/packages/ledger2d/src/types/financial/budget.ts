import { HDNodeWallet } from 'ethers'
import { BaseMemory } from '../memory';
import redis from "../../utils/redis";
import { randomUUID } from "crypto";

interface BUDGET {summary:string,description:string,amount: number};
export async function createBudget({summary,description,amount}: BUDGET) {
    const id =  randomUUID();
    if(await redis.get(`budget:${id}`)){return;};
    await redis.set(`budget:${id}:summary`,summary || "");
    await redis.set(`budget:${id}:description`, description || "");
    await redis.set(`budget:${id}:amount`, amount);
    // if (tasks && tasks){
    //     await Promise.all(tasks.map(async(task)=>{
    //         await redis.set(`task:${task}:id`, id);
    //         return;
    //     }));
    // }
    return {id,summary,description,amount};
}