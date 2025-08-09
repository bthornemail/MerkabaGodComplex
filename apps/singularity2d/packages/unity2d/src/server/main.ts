import { TestEnvironment } from "./test/components/test.environments";
import { Agent } from "./agents/agent";
import { Vector3 } from "three";
import { ServerEnvironment, ClientEnvironment } from "./types/environment/online.environment";
// import { HDNodeWallet } from "ethers";

(async () => {
  const env = new TestEnvironment("tester@unity2d");
  // const Unity2D: ServerEnvironment = env.getProvider();
  // Unity2D.io();
  const Providers: ServerEnvironment[] = env.getProviders(1);
  // const providerCount = 2
  // const Providers: ServerEnvironment[] = ([
  //   [8888, "Vault2D", "type bullet alley learn crumble now size tube design abstract debate toy"],
  //   [3800, "Unity2D", "special govern replace virus mistake marriage tail nurse able high garage salmon"],
  //   [3802, "Chat2D", "regular about daughter wide autumn pony assault woman treat claim trial supreme"],
  //   [3803, "Marketplace2D", "dawn gallery history crime knock income blossom catalog piece kiss arrive culture"],
  //   [3804, "University2D", "sense hybrid relax island palm elbow you want tattoo grape connect cash"]
  // ] as [number, string, string][])
  // .slice(0, providerCount)
  // .map(([port, identity, phrase]) => {
  //   const host = "127.0.0.1";
  //   const protocol = "http";
  //   const path: string = "m/369/0";
  //   const password = identity;
  //   const wallet = HDNodeWallet.fromPhrase(phrase, password, path);
  //   const signer = wallet.signingKey
  //   const keyStore = wallet.encryptSync(password ?? wallet.address);
  //   const env = new ServerEnvironment({ keyStore, encryptedWallet: keyStore, identity, signer, wallet, password: password ?? wallet.address, extendedKey: wallet.extendedKey, host, protocol, port, merkleRoot: "" });
  //   return env;
  // });
  for(const peer of Providers){
    peer.io();
    await peer.connect();
    peer.sse();
  }
  const BrianThorne: ClientEnvironment = env.getUser();
  BrianThorne.socket();
  await BrianThorne.connect();

  const Peers: ClientEnvironment[] = env.getPeers(2);
  for(const peer of Peers){
    peer.socket();
    await peer.connect();
  }
  const agent = new Agent({});
  const agent2 = new Agent({});
  BrianThorne.addAgent(agent)
  BrianThorne.addAgent(agent2)
  BrianThorne.getCurrentPosition(agent2);
  agent2.sphere.translateX(1);
  agent2.sphere.position.add(new Vector3(1, 1, 1));
  agent.sphere.position.add(new Vector3(3, 3, 3));
  BrianThorne.getCurrentPosition(agent);
  BrianThorne.getCurrentPosition(agent2);
  BrianThorne.scene.add(agent.sphere);
  BrianThorne.scene.add(agent2.sphere);
  BrianThorne.scene.children.forEach((child) => {
    [agent,agent2]
    .forEach(agent=>{
        if(child.id !== agent.sphere.id) return;
        BrianThorne.getCurrentPosition(agent);
      })
  });
})();