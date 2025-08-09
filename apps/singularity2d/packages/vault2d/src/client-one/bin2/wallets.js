
import { Wallet, HDNodeWallet, HDNodeVoidWallet } from "https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js";
// Generate wallets

// const masterNode: HDNodeWallet = HDNodeWallet.createRandom();
// const mnemonic = masterNode.mnemonic;
// console.log(mnemonic?.phrase)
// const masterWallet = HDNodeWallet.fromMnemonic(masterNode.mnemonic!)
// export const extra_wallet_0 = HDNodeWallet.fromPhrase("fragile chair exile people dragon social emotion squeeze upset practice sniff middle", undefined, "m/0")
// export const extra_wallet_1 = HDNodeWallet.fromPhrase("misery clean step badge evoke current promote measure cram tumble quiz fragile", undefined, "m/0")
const numChildWallets = 10;
export const masterWallet = HDNodeWallet.fromPhrase("type bullet alley learn crumble now size tube design abstract debate toy", undefined, "m/0")
export const childWallets = Array.from(Array(numChildWallets).keys()).map(index => masterWallet.derivePath(`${index}`));

export const MarketplaceWallet = masterWallet;
export const HostWallet = HDNodeWallet.fromPhrase("special govern replace virus mistake marriage tail nurse able high garage salmon", undefined, "m/0")
export const ClientWallet = HDNodeWallet.fromPhrase("sense hybrid relax island palm elbow you want tattoo grape connect cash", undefined, "m/0");
export const ProviderWallet = HDNodeWallet.fromPhrase("dawn gallery history crime knock income blossom catalog piece kiss arrive culture", undefined, "m/0")
export const QuickWheelWashWallet = ProviderWallet.deriveChild(0);
export const WashTypeWallet = QuickWheelWashWallet.deriveChild(0);
export const GlossTypeWallet = QuickWheelWashWallet.deriveChild(1);
export const CleanTypeWallet = QuickWheelWashWallet.deriveChild(2);
export const ScheduledDateWallet = QuickWheelWashWallet.deriveChild(3);
export const ConsumerWallet = HDNodeWallet.fromPhrase("regular about daughter wide autumn pony assault woman treat claim trial supreme", undefined, "m/0")
export const CustomerWallet = ConsumerWallet.deriveChild(0);

export const MarketplaceAddress = MarketplaceWallet.address;
export const HostAddress = HostWallet.address;
export const ClientAddress = ClientWallet.address;
export const ProviderAddress = ProviderWallet.address;
export const QuickWheelWashWalletAddress = QuickWheelWashWallet.address;
export const ConsumerAddress = ConsumerWallet.address;
export const CustomerAddress = CustomerWallet.address;

export const wallets = new Map([
    ["HostAddress", HostWallet],
    ["ProviderAddress", ProviderWallet],
    ["ConsumerAddress", ConsumerWallet],
    ["CustomerAddress", CustomerWallet],
    ["QuickWheelWashWalletAddress", QuickWheelWashWallet],
    ["ClientAddress", ClientWallet],
    ["MarketplaceAddress", MarketplaceWallet]
]);
export const addresses = new Map(Array.from(wallets).map(wallet => [wallet[0], wallet[1].address]))
export default "type bullet alley learn crumble now size tube design abstract debate toy"
//     const accessMethodDescription = `text/plain;charset=UTF-8?phone=1234567890&contentUrl=http://example.com/data${index}`;
//     const dataStructureDescription = `The data package includes multiple fields such as 'name', 'age', and 'email'. Each field is represented as a key-value pair in JSON format.`;
//     const rootArticleUrl = `http://${"127.0.0.1:3000" }/${QuickWheelWashWallet}`;

//     const articleDescription = `Access Method: ${accessMethodDescription}\nData Structure: ${dataStructureDescription}\nRoot Article URL: ${rootArticleUrl}`;
//     const articleUrl = `http://127.0.0.1:3000/api/article${index}?authorFingerprint=${authorFingerprint}&signature=${signatureString}`;
