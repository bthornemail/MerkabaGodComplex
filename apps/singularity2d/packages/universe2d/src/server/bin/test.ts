import { HDNodeWallet, id } from "ethers";
import { TestUser } from "./test.user";
import { TestPeer } from "./test.peer";

// const mnemonic = 'shine ice fringe mirror sweet top opera destroy hold have green pride'
// const mnemonic2 = 'warrior february deal bridge distance hole royal street either teach model judge'
// const phrase = 'minute provide boil sniff pattern upper thing mind chaos hotel garlic spin';
// const phrase2 = 'region offer knee exile bacon fog rather frog remind fish music staff';

// const userA = Wallet.fromPhrase(mnemonic)
// const userB = Wallet.fromPhrase(mnemonic2)
// const userC = Wallet.fromPhrase(phrase)
// const userD = Wallet.fromPhrase(phrase2)
const protocol = "http";
const host = "127.0.0.1";
const user = HDNodeWallet.fromPhrase("window strategy famous zone jungle allow soda dismiss current produce right visual");
const password = "window strategy famous zone jungle allow soda dismiss current produce right visual";
const testUser = TestUser({ identity: "Brian Thorne", host, protocol, port: 8888, encryptedWallet: user.encryptSync(password), password })
console.log(testUser());

const count = 2;
const peerEnv = ([
  [8888, "Client", "type bullet alley learn crumble now size tube design abstract debate toy"],
  [8888, "Broker", "special govern replace virus mistake marriage tail nurse able high garage salmon"],
  [8888, "Host", "regular about daughter wide autumn pony assault woman treat claim trial supreme"],
  [8888, "Provider", "dawn gallery history crime knock income blossom catalog piece kiss arrive culture"],
  [8888, "Consumer", "sense hybrid relax island palm elbow you want tattoo grape connect cash"]
])
  .slice(0, count)
  .map(([port, identity, phrase]) => {
	const path = "m/369/0";
	const host = "127.0.0.1";
	const protocol = "ws"
	const password = phrase;
	// const wallet = HDNodeWallet.fromMnemonic(Mnemonic.fromEntropy(privateKey));
	const wallet = HDNodeWallet.fromPhrase(phrase, password, path);
	const signer = wallet.signingKey
	const keyStore = wallet.encryptSync(password);
	return TestPeer({ keyStore, encryptedWallet: keyStore, identity, signer, wallet, password, extendedKey: wallet.extendedKey, host, protocol, port, merkleRoot: "" })();
  });
console.log(peerEnv);
describe("This is a vault process outline", () => {
	it("List processes to de done");
	it("Shows pending for tasks not started");
	it("Shows fail for started but not stopped");
});