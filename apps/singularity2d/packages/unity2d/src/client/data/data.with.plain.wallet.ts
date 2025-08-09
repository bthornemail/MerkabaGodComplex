import { Wallet } from "ethers/wallet";
import ip, { ip4Addresses } from '../bin/ip'
import redis, { db1, db2 } from "../services/redis";
import addTime from "../bin/add.time";

const Host = "127.0.0.1";
const OnlineHost = "127.0.0.1";
const ServerPort = 3000;
const SocketIOPort = 3333;
const MosquitoPort = 3883;
const ReactPort = 5173;
const RedisPort = 6739;


const HostWallet = new Wallet("0x3d396fab831923c3ebe7f28549d5d68df0ba4348c40d01075cb0175ebdd9ed72")
const ProviderWallet = new Wallet("0x64d4dfa33115467a56dec51731cee8cd927be277a765e68a3f370cfe5ec88399")
const ConsumerWallet = new Wallet("0xd8b5fd6c7bd6961a18e3822555ce241bcf65dbb3bcc6bd82e1839566b50b0224")
const QuickWheelWashWallet = new Wallet("0x528bb5e598fc00f37b34d4334d973942ef7e416b62382f442949fb7023a887bd");
const ClientWallet = new Wallet("0x3923375b4a1c9833a3062a2bb6bdae270b022e12965b003dcd28baede66b3be8");
const MarketplaceWallet = new Wallet("0x528bb5e598fc00f37b34d4334d973942ef7e416b62382f442949fb7023a887bd")

const HostAddress = HostWallet.address;
const ProviderAddress = ProviderWallet.address;
const ConsumerAddress = ConsumerWallet.address;
const QuickWheelWashWalletAddress = QuickWheelWashWallet.address;
const ClientAddress = ClientWallet.address;
const MarketplaceAddress = MarketplaceWallet.address;

const wallets = new Map([
    ["HostAddress", HostWallet],
    ["ProviderAddress", ProviderWallet],
    ["ConsumerAddress", ConsumerWallet],
    ["QuickWheelWashWalletAddress", QuickWheelWashWallet],
    ["ClientAddress", ClientWallet],
    ["MarketplaceAddress", MarketplaceWallet]
]);
const addresses = new Map(Array.from(wallets).map(wallet => [wallet[0], wallet[1].address]))
console.log({ ip })
console.log({addresses});


const startDate = new Date().toISOString();
const scheduleDate = addTime(new Date(startDate),0,1);

(async () => {
    await redis.flushdb()
    await db1.flushdb()
    await db2.flushdb()
    // Upload Ip Address
    await redis.hset("ip", new Map([...[
        ["title", "ip"],
        ["summary", "list of ip addresses"],
        ["author", QuickWheelWashWalletAddress],
        ["signature", QuickWheelWashWallet.signMessageSync("ip")]
    ], ...ip4Addresses]))

    // Create Page Data
    await redis.hset("Quick Wheel Wash", new Map([
        ["title", "Quick Wheel Wash"],
        ["summary", "Tire and Rim hand wash"],
        ["description", "We hand wash your rims and tires, optionally applying gloss and environmental protectant"],
        ["author", QuickWheelWashWalletAddress],
        ["signature", QuickWheelWashWallet.signMessageSync("Quick Wheel Wash")]
    ]))
    await redis.hset("Quick Wheel Wash/Working Schedule", new Map([
        ["title", "Working Schedule"],
        ["summary", "Quick Wheel Wash Working Schedule"],
        ["author", QuickWheelWashWalletAddress],
        ["signature", QuickWheelWashWallet.signMessageSync("Quick Wheel Wash/Working Schedule")],
        ["2024-05-14T08:30:00", HostAddress],
        ["2024-05-14T09:00:00", ProviderAddress],
        [scheduleDate, ConsumerAddress],
        ["2024-05-14T10:30:00", null],
        ["2024-05-14T11:30:00", null],
        ["2024-05-14T12:30:00", null],
        ["2024-05-14T13:30:00", null],
        ["2024-05-14T14:30:00", null],
        ["2024-05-14T15:30:00", null],
        ["2024-05-14T16:30:00", null],

    ]));
    await redis.hset(`Quick Wheel Wash:Wash Type`, new Map([
        ["title", "Wash Type"],
        ["summary", "Wash Type Options"],
        ["author", QuickWheelWashWalletAddress],
        ["signature", QuickWheelWashWallet.signMessageSync("Quick Wheel Wash/Working Schedule")],
        ["basic-wash", "5"],
        ["detailed-wash", "20"]
    ]));
    await redis.hset(`Quick Wheel Wash/Gloss Type`, new Map([
        ["title", "Gloss Type"],
        ["summary", "Gloss Type Options"],
        ["author", QuickWheelWashWalletAddress],
        ["signature", QuickWheelWashWallet.signMessageSync("Quick Wheel Wash/Working Schedule")],
        ["basic-gloss", "0"],
        ["matte-gloss", "0"],
        ["oil-gloss", "1"],
        ["wet-gloss", "1"]
    ]));
    await redis.hset(`Quick Wheel Wash/Clean Type`, new Map([
        ["title", "Clean Type"],
        ["summary", "Clean Type Options"],
        ["chemical-clean", "0"],
        ["green-clean", "0"],
        ["compound-clean", "5"],
        ["detailed-clean", "10"]
    ]));
    // Create page chat data
    await redis.hset(`Quick Wheel Wash/Order/${scheduleDate}/${QuickWheelWashWalletAddress}`, new Map([
        ["title", "Order State"],
        ["summary", "state of current order"],
        ["author", QuickWheelWashWalletAddress],
        ["signature", QuickWheelWashWallet.signMessageSync(`Quick Wheel Wash/Order/${scheduleDate}/${QuickWheelWashWalletAddress}`)],
        ["provider", ProviderAddress],
        ["consumer", ConsumerAddress],
        [scheduleDate, "Order Recieved"],
        [ addTime(new Date(scheduleDate),0,0,1), "Order Dispatched"],
        [addTime(new Date(scheduleDate),0,0,2), "Work Started"],
        [addTime(new Date(scheduleDate),0,0,5), "First Wheel Complete"],
        [addTime(new Date(scheduleDate),0,0,5,30), "New Image Added"],
        [addTime(new Date(scheduleDate),0,0,17), "Order Complete"]
    ]));
    await redis.hset(`Quick Wheel Wash/Order/${scheduleDate}/${ProviderAddress}`, new Map([
        ["title", "Quick Wheel Wash"],
        ["summary", "Wash Estimate"],
        ["author", ProviderAddress],
        ["signature", ProviderWallet.signMessageSync(`Quick Wheel Wash/Order/${scheduleDate}/${ProviderAddress}`)],
        [addTime(new Date(startDate),0,0,30), "Hey, How can I help you today?"],
        [addTime(new Date(startDate),0,0,33), "a Basic Wash, Matte Gloss, Basic Clean\nOkay, what time are you interested in?"],
        [addTime(new Date(startDate),0,0,35), "Yes, I'm available for that service at that time, please confirm"],
        [addTime(new Date(startDate),0,0,38), "I recived your confirmation and will start at " + scheduleDate]
    ]))
    await redis.hset(`Quick Wheel Wash/Order/${scheduleDate}/${ConsumerAddress}`, new Map([
        ["title", "Quick Wheel Wash"],
        ["summary", "Wash Estimate"],
        ["author", ConsumerAddress],
        ["signature", ConsumerWallet.signMessageSync("Quick Wheel Wash")],
        [addTime(new Date(startDate),0,0,31), "I would like a quote"],
        [addTime(new Date(startDate),0,0,31,30), "Basic Wash, Matte Gloss, Basic Clean,"],
        [addTime(new Date(startDate),0,0,34), scheduleDate],
        [addTime(new Date(startDate),0,0,37), ConsumerWallet.signMessageSync(scheduleDate)],
        [addTime(new Date(startDate),0,0,39), "Thank you, give me updates."],
    ]));

    // Create page order data
    await redis.hset(`Quick Wheel Wash/Order/${QuickWheelWashWalletAddress}/${scheduleDate}`, new Map([
        ["title", "Order State"],
        ["summary", "state of current order"],
        ["author", QuickWheelWashWalletAddress],
        ["signature", QuickWheelWashWallet.signMessageSync(`Quick Wheel Wash/Order/${scheduleDate}`)],
        ["provider", ProviderAddress],
        ["consumer", ConsumerAddress]
    ]));
    await redis.hset(`Quick Wheel Wash/Order/${ConsumerAddress}/${scheduleDate}`, new Map([
        ["title", "Purchase Order"],
        ["summary", "Purchase Order Quote"],
        ["author", ConsumerAddress],
        ["signature", ConsumerWallet.signMessageSync(`Quick Wheel Wash/Order/${ConsumerAddress}/${scheduleDate}`)],
        ["amount", "5"],
        ["quote-date", scheduleDate],
        ["wash-type", "basic-wash"],
        ["gloss-type", "basic-gloss"],
        ["clean-type", "green-clean"],
        ["schedule-date", scheduleDate]
    ]));
    await redis.hset(`Quick Wheel Wash/Order/${ProviderAddress}/${scheduleDate}`, new Map([
        ["title", "Purchase Order"],
        ["summary", "Purchase Order Quote"],
        ["author", ProviderAddress],
        ["signature", ProviderWallet.signMessageSync(`Quick Wheel Wash/Order/${ProviderAddress}/${scheduleDate}`)],
        ["amount", "15"],
        ["quote-date", scheduleDate],
        ["wash-type", "basic-wash"],
        ["gloss-type", "basic-gloss"],
        ["clean-type", "green-clean"],
        ["schedule-date", scheduleDate]
    ]));

})()
// export { Host , OnlineHost, ServerPort, SocketIOPort, MosquitoPort, ReactPort, RedisPort}
export { HostWallet,ProviderWallet,ConsumerWallet,QuickWheelWashWallet,ClientWallet,MarketplaceWallet}
export { HostAddress,ProviderAddress,ConsumerAddress,QuickWheelWashWalletAddress,ClientAddress,MarketplaceAddress}
export { wallets , addresses}