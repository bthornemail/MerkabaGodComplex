import { ethers, Wallet } from 'ethers';
// import { Person, Transfer, Service, Asset, Exam as ExamType } from './typed.data.js';
import SocketNode from './modules/Socket.Node.js';
class Exam extends SocketNode {
    // socket;
    // wallet;
    // user;
    // assets = {};
    // services = {};
    register;
    sign = async (value = {
        from: {
            name: 'Cow',
            wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826'
        },
        to: {
            name: 'Bob',
            wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB'
        },
        value: 256
    }) => {
        const signature = await signer._signTypedData(this.domain, { Person: this.Person, Transfer: this.Transfer }, value);
        return signature;
    }

    constructor(node,{name,peerId,multiaddrs} = {name:null,peerId:null,multiaddrs:[]}) {
        super(node,{name,peerId,multiaddrs});
        this.domain = {
            name: 'Exam Proctor',
            version: '1',
            chainId: 1,
            verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC'
        }
        this.prices = {};  // examCID -> price
        this.ownership = {};  // examCID -> ownerPublicKey
    }
    registerAsset = (name, value, metadata) => {
        let asset = {};
        asset[name] = { owner: this.user.address, value, metadata };
    }
}
export default Exam;

(async () => {
    const mnemonic = 'shine ice fringe mirror sweet top opera destroy hold have green pride'
    const mnemonic2 = 'warrior february deal bridge distance hole royal street either teach model judge'
    const phrase = 'minute provide boil sniff pattern upper thing mind chaos hotel garlic spin';
    const phrase2 = 'region offer knee exile bacon fog rather frog remind fish music staff';

    const userA = Wallet.fromPhrase(mnemonic)
    const userB = Wallet.fromPhrase(mnemonic2)
    const userC = Wallet.fromPhrase(phrase)
    const userD = Wallet.fromPhrase(phrase2)
    // const tokenInstance = new Token(null,{name:"Coin 2D"});
    // const marketplaceInstance = new Marketplace();
    const exam = new Exam(null,{name:"Exam"})

    // Example usage

    // Mint some tokens to a user (publicKey = "UserA")
    // tokenInstance.mint(userA.address, 100);

    // Provide conditional tokens from "UserA" to "UserB" for exam with CID "Exam1"
    // tokenInstance.provideTokensConditionally(userA.address, userB.address, 50, "Exam1", Date.now() + 3600000, null, "signature");

    // Assume the marketplace has a price for "Exam1"
    // marketplaceInstance.examPrice["Exam1"] = 40;

    // // Use conditional tokens to purchase or submit "Exam1"
    // const giver = "UserA";  // In a real-world scenario, thi s should be determined programmatically.
    // const result = tokenInstance.useConditionalTokens("UserB", "Exam1", marketplaceInstance);

    // console.log(result);  // Should output true
    // console.log(tokenInstance.balances);  // Should show updated balances
    // console.log(tokenInstance.conditionalTokens);  // Should show updated conditional tokens
})()