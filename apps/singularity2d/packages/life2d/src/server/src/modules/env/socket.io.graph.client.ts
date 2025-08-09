import { io } from "socket.io-client";
import { Wallet } from "ethers";
import openEnvironment from "./openEnvironment";

import { environment, actor, action, time } from "./schema";

const socket = io("http://127.0.0.1:3000",{
    auth: {
        identity: Wallet.createRandom().address
    },
});

const Brian = openEnvironment([environment, actor, action, time])
socket.on("connect", async () => {
    const brian = await Brian;
    await brian("Chat/0xTay", "Hey what's good?");
    console.log("Client connected: ", socket.id)
    socket.emit("status", {environment, actor, action, time},async (status: any) => {
        console.log("Client status: ", status)
    })
});

socket.on("disconnect", () => {
    console.log("socket disconnected"); // undefined
});