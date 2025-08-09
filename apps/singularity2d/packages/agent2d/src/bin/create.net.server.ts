import { HDNodeWallet } from "ethers";
import { unlinkSync } from "fs";
import { AddressInfo, Server } from "net";
import { log } from "./communication.server";

export default async function createNetServer(block: [extendedKey: string, root: string, graphData: string, signature: string]): Promise<Server> {
    const [extendedKey, root, graphData, signature] = block;
    const entity = HDNodeWallet.fromExtendedKey(extendedKey).address;
    const ipcFilePath = `./${root}.ipc`;
    const server = new Server((socket) => {
        const { address, family, port } = socket.address() as AddressInfo;
        const url = port ?  `${family}://${address}:${port}` : ipcFilePath;
        log(entity,` New Socket Connected: ${url}`);
    })
    server.listen(ipcFilePath, () => {
        log(entity," Server listening on ", ipcFilePath);
    });
    process.on("exit", () => {
        unlinkSync(ipcFilePath);
        return;
    });
    return server;
};