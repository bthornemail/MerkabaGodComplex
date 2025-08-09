
import { HDNodeWallet } from "ethers";
import Memcached from 'memcached';
import Graphology from 'graphology';
const peerData = {};

const location = "http://127.0.0.1"
export function TestGraph({ extendedKey }: { extendedKey: string }) {
    try {
        const PeerWallet = HDNodeWallet.fromExtendedKey(extendedKey);
        console.log("Initializing Peer " + PeerWallet.address)
        const wallets = new Map([
            ["Vault2D", PeerWallet.deriveChild(1).deriveChild(8001)],
            ["Chat2D", PeerWallet.deriveChild(1).deriveChild(8002)],
            ["Ledger2D", PeerWallet.deriveChild(1).deriveChild(8003)],
            ["Unity2D", PeerWallet.deriveChild(1).deriveChild(8004)],
            ["Life2D", PeerWallet.deriveChild(1).deriveChild(8005)],
            ["Marketplace2D", PeerWallet.deriveChild(1).deriveChild(8006)],
            ["Knowledge2D", PeerWallet.deriveChild(1).deriveChild(8007)],
        ]);
        const memcached = new Memcached(['192.168.8.1:11211', "127.0.0.1:11211"]);
        console.log("Memcached Initialized")
        memcached.on('issue', function (details) { console.error("Server " + details.server + "went down due to: " + details.messages.join('')) });
        memcached.on('failure', function (details) { console.error("Server " + details.server + "went down due to: " + details.messages.join('')) });
        memcached.on('reconnecting', function (details) { console.debug("Total downtime caused by server " + details.server + " :" + details.totalDownTime + "ms") });
        console.log("Memcached Active")

        const expiration = 60 * 24 * 365;
        memcached.set('active', extendedKey, 10, function (err) {
            if (err) throw new Error("Already Exist");
            console.log("Setting Active")
            memcached.get('active', function (err, data) {
                console.log("memcached get 'active'", data);
            });
        });
        for (const [label, wallet] of wallets.entries()) {
            memcached.set(label, JSON.stringify(Object.assign({}, wallet,
                wallet.path?.split("/")[wallet.depth].includes("800")
                    ? {
                        title: label,
                        content: `text/plain;charset=UTF-8?phone=1234567890&contentUrl=http://${label.toLowerCase()}.com/${wallet.publicKey}`,
                        url: `${location.toLowerCase()}:${wallet.path?.split("/")[wallet.depth]}/${wallet.publicKey}`,
                        port: wallet.path?.split("/")[wallet.depth],
                        link: `${location}:${wallet.path}`,
                        collapsed: wallet.depth >= 5
                    }
                    : {
                        title: label,
                        content: `text/plain;charset=UTF-8?phone=1234567890&contentUrl=${location}:3001/${wallet.publicKey}`,
                        url: `${location}:3001/${wallet.publicKey}`,
                        link: `${location}:${wallet.path}`,
                        collapsed: wallet.depth >= 5
                    }
            )), expiration, function (err) {
                if (err) throw new Error("Already Exist");
                memcached.get(label, function (err, data) {
                    if (err) throw new Error("Not Found");
                    console.log(label, "Memchaed Data -\n", JSON.parse(data));
                });
            });
        }
    } catch (error) {
        console.log(error)
    }
    const graph = new Graphology({ multi: true });
    graph.import(peerData)
    return () => Object.assign({}, {
        // merkleTree: null,
        merkleRoot: null,
        extendedKey,
        dht: null,
        graph,
    });
}