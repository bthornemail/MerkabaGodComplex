import { HDNodeWallet, verifyMessage, SignatureLike, sha256, id } from 'ethers';
import Broker from './modules/broker/index';
import { Graph } from './modules/graph';
import { Environment } from './test/modules/environment';
import { Vault } from '.';
const entity = HDNodeWallet.fromPhrase("fun dwarf until ghost ahead biology toilet gym obvious copper clarify pool").neuter().extendedKey;
const entity2 = HDNodeWallet.fromPhrase("roast thank tiny coach seat ensure cruel auto shaft finish fee resemble").neuter().extendedKey;
let b1:string;
let entityInput:string;
(async () => {
    const environment = new Environment();
    const broker = new Broker({ content: { entity,definitions: { properties: { brokerUrl: ["ws://127.0.0.1"] }, attributes: { ports: [3883] }, events: {}, references: {} } } });
    b1 = broker.identity;
    const vault = new Vault();
    const graph = new Graph({ content: { entity } });
    environment.register({ broker, vault });
    await broker.activate();
    entityInput = await graph.activate({ content: { entity: entity2, parameters:{features: { 0: ["ipc"] },},definitions: { properties: { ipcPath: [`./tmp/${entity}`] } } }});
})();
(async () => {
    const environment = new Environment();
    const broker = new Broker({ content: { definitions: { properties: { brokerName: ["John Broker"], brokerUrl: ["ws://127.0.0.1"] }, attributes: { ports: [3883] }, events: {}, references: {} } } });
    await broker.activate();
    broker.client.publish(b1, "hi")
    const vault = new Vault();
    const graph = new Graph({
        content: {
            entity: id(entity2),
            parameters: { features: { 0: ["ipc"] } },
            definitions: {
                properties: {
                    ipcPath: [`./tmp/${id(entity2)}`]
                }
            }
        }
    });
    environment.register({ broker, vault, graph });
    await graph.propagate({
        content: {
            parameters: {
                features: { 0: ["ipc"] },
            },
            definitions: {
                properties: {
                    ipcPath: [`./tmp/${entity}`]
                },
                references: {
                    outputs: {
                        [entity]: [entityInput]
                    }
                }
            }
        }
    });
})();
// (async () => {
//     const environment = new Environment();
//     const broker = new Broker({ content: { definitions: { properties: { brokerUrl: ["http://127.0.0.1"] }, attributes: { ports: [3883] }, events: {}, references: {} } } });
//     await broker.activate();
//     const vault = new Vault();
//     const peerSCGCN = new Graph({ content:{entity: HDNodeWallet.fromPhrase("fun dwarf until ghost ahead biology toilet gym obvious copper clarify pool").neuter().extendedKey }});
//     environment.register({ broker, vault, scgcn: peerSCGCN });
//     await peerSCGCN.propagate({ definitions: { features: { ipc: true } } });
// })();