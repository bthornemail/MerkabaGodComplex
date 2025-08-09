import { Server } from "socket.io";

import { Marketplace2dEnvironment, Marketplace2dAction, Marketplace2dTime, Marketplace2dActor } from "../components/graph/schema";
import DynamicNode from "../components/graph/graph.node";

const io = new Server({
    cors: {
        origin: "*"
    }
});
io.use(async (socket, next) => {
    try {
        console.log("identity",socket.handshake.auth.identity)
        next()
    } catch (e) {
        next(new Error("unknown user"));
    }
});

const Martketplace2d = new DynamicNode([Marketplace2dEnvironment, Marketplace2dActor, Marketplace2dAction, Marketplace2dTime])
io.on("connection", async (socket) => {
    const martketplace2d = await Martketplace2d.path;
    await martketplace2d("Chat/0xTay", "Hey what's good?");
    console.log("Clients connected", io.of("/").sockets.size)
    console.log("Client connected", socket.id)
    socket.on("status",({environment, actor, action, time},callback)=>{
        console.log({environment});
        console.log({actor});
        console.log({action});
        console.log({time});
        callback(io.of("/").sockets.size)
    })

});
io.listen(3000);