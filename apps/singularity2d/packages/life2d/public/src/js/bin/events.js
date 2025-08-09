export default function EventRegister(node) {
    // Existing 'look' event
    node.libp2p.addEventListener('look', (event) => {
        const peerId = event.detail.peerId;
        console.log("look event triggered", event.detail);
    });

    // Marketplace events
    const domains = ['user', 'delegate', 'token', 'marketplace', 'asset', 'service', 'exam'];
    const events = ['create', 'register', 'request', 'post', 'remove', 'update', 'mint', 'transfer', 'escrow'];
    const lifeCycles = ['start', 'progress', 'complete', 'fail']; // Example life cycle stages

    for (const domain of domains) {
        for (const event of events) {
            for (const lifeCycle of lifeCycles) {
                const eventName = `${domain}:${event}:${lifeCycle}`;

                node.libp2p.addEventListener(eventName, async (eventDetail) => {
                    console.log(bright, yellow, `${eventName} triggered`, eventDetail.detail, reset);
                    // Additional async operations can go here
                });
            }
        }
    }
}

export function EventDispatch(node) {
    node.libp2p.addEventListener('look', (event) => {
        const peerId = event.detail; console.log(bright, yellow, "look", reset, Object.entries(event))
    })
    // beliw i added thes evnt listeners and dispatch from another file.  i will convert them to libp2o events
    // const evt = new Event("look");
    node.libp2p.safeDispatchEvent("look", { detail: { name, wallet, key, privateKey, account, peerId } })
    node.libp2p.safeDispatchEvent("new:peer-id", this.peerId)
    node.libp2p.safeDispatchEvent("new:multiaddr", this.multiaddrs[0]);
    node.libp2p.safeDispatchEvent("new:multiaddrs", this.multiaddrs);

    node.libp2p.addEventListener("new:multiaddrs", async (multiaddrs) => multiaddrs.forEach(async (multiaddr) => await this.dialPeer(multiaddr)));
    node.libp2p.addEventListener("new:multiaddr", this.dialPeer);

    node.libp2p.addEventListener("coin2d:mint", async (cid) => {
        // console.log("coin2d:mint", cid)
        const file = await this.dag.get(CID.parse(cid));
        return console.log(bright, green, "coin2d:mint", reset, file)
    })
    node.libp2p.addEventListener("register:asset", async () => { });
    node.libp2p.addEventListener("register:service", async () => { });
    node.libp2p.addEventListener("register:course", async () => { });
    node.libp2p.addEventListener("register:exam", async () => { });
    node.libp2p.addEventListener("register:task", async () => { });
    node.libp2p.addEventListener("register:test", async () => { });
    node.libp2p.addEventListener("get:asset", async () => { });
    node.libp2p.addEventListener("get:service", async () => { });
    node.libp2p.addEventListener("get:course", async () => { });

}
