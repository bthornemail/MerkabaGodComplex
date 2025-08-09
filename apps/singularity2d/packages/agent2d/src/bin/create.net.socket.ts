import { HDNodeWallet } from "ethers";
import { AddressInfo, Socket } from "net";
import { log } from "./communication.server";

export default async function createNetSocket(block: [extendedKey: string, root: string, graphData: string, signature: string]): Promise<Socket> {
    const [extendedKey, root, graphData, signature] = block;
    const entity = HDNodeWallet.fromExtendedKey(extendedKey).address;
    const ipcFilePath = `./${root}.ipc`;
    const socket = new Socket()
    socket.connect(ipcFilePath, () => {
        const { address, family, port } = socket.address() as AddressInfo;
        const url = port ? `${family}://${address}:${port}` : ipcFilePath;
        log(entity, `Socket Connected: ${url}`);
    });
    return socket;
};