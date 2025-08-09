import { multiaddr } from '@multiformats/multiaddr';
import showWelcomeMessage from '../components/System/menu/show.welcome.message';

export default function getDefaultCommands(cli: any, node: any): any{

    const commands = [
        {
            name: 'connect', summary: 'Connect NODE',
            // input: [], output: ['string'],
            code: node.connect
        },
        {
            name: 'view peers', summary: 'View Peers',
            // input: [], output: ['string'],
            code: node.node?.libp2p.getPeers
        },
        {
            name: 'dial protocol', summary: 'Connect to a protocol',
            // input: [
            //   '/ip4/127.0.0.1/tcp/35353/p2p/16Uiu2HAmVboqPtEibQihzkYNQq7gKjfbqPQFziqdU2xDv2ZEN7R3',
            //   '/vault_ai/0.1.0/bgpt/0.1.0'],
            // output: ['string'],
            code: () => {
                const knownProtocols: [string, string][] = [
                    ['/ip4/127.0.0.1/tcp/35353/p2p/16Uiu2HAmVboqPtEibQihzkYNQq7gKjfbqPQFziqdU2xDv2ZEN7R3', '/vault_ai/0.1.0/bgpt/0.1.0']
                ]
                showWelcomeMessage({ title: "Protocols", summary: "Select a protocol", menu: knownProtocols })
                // cli.rl.close()   
                cli.rl.setPrompt('What Protocol?')
                cli.rl.prompt()
                cli.rl.once('line', async (line: string) => {
                    try {
                        console.log("Init Protocols")
                        switch (line) {
                            case "0":
                                console.log("Connecting Protocol")
                                console.log(node.node)
                                console.log(node.node?.libp2p)
                                console.log(await node.node?.libp2p.dialProtocol(multiaddr('/ip4/127.0.0.1/tcp/35353/p2p/16Uiu2HAmVboqPtEibQihzkYNQq7gKjfbqPQFziqdU2xDv2ZEN7R3'), '/vault_ai/0.1.0/json-rpc-cli/0.1.0'))
                                break;
                            default:
                                console.log("No Protocols Available")
                                break;
                        }
                    } catch (error) {
                        console.log(error)
                    }
                })

                // cli.rl.question('What Protocol?\n' + knownProtocols.map((protocol, index) => {
                //   return `${index}. ${protocol[1]}\n`
                // }), async (answer: string) => {
                //   try {

                //     switch (answer) {
                //       case "0":
                //         console.log(await node.node?.libp2p.dialProtocol(multiaddr('/ip4/127.0.0.1/tcp/35353/p2p/16Uiu2HAmVboqPtEibQihzkYNQq7gKjfbqPQFziqdU2xDv2ZEN7R3'), '/vault_ai/0.1.0/bgpt/0.1.0'))
                //         break;
                //       default:
                //         console.log("No Protocols Available")
                //         break;
                //     }
                //   } catch (error) {
                //     console.log(error)
                //   }
                // })
            }
        },
        {
            name: 'exit', summary: "Exit Program",
            code: process.exit
        }
    ]
    return commands
}