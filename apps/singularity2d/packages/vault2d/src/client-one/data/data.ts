// export { Host , OnlineHost, ServerPort, SocketIOPort, MosquitoPort, ReactPort, RedisPort}
import { HostWallet, ProviderWallet, ConsumerWallet,CustomerWallet, QuickWheelWashWallet, ClientWallet, MarketplaceWallet } from '../bin/wallets.js'
import { HostAddress, ProviderAddress, ConsumerAddress,CustomerAddress, QuickWheelWashWalletAddress, ClientAddress, MarketplaceAddress } from '../bin/wallets.js'

export default function addTime(date, days = 0, hours = 0, minutes = 0, seconds = 0) {
    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const millisecondsPerHour = 60 * 60 * 1000;
    const millisecondsPerMinute = 60 * 1000;
    const millisecondsPerSecond = 1000;

    const newDate = new Date(
        date.getTime() +
        days * millisecondsPerDay +
        hours * millisecondsPerHour +
        minutes * millisecondsPerMinute +
        seconds * millisecondsPerSecond
    );

    return newDate.toUTCString();
}

const startDate = new Date()
const scheduleDate = addTime(startDate, 0, 1);
// ```mermaid
// ---
// title: Service_Board
// --- 

// flowchart TD
//     Consumer --> Customer
//     Customer --> Order
//     Order --> Consideration
//     Consideration --> Confirmation
//     Confirmation --> Declaration
//     Declaration --> Invoice
//     Invoice --> Service

//     Provider --> Contractor 
//     Contractor --> Contract
//     Contract --> Fulfillment
//     Fulfillment --> Resolution
//     Fulfillment --> Proposal
//     Proposal --> Agreement
//     Agreement --> Service
// ```
// ```mermaid
// ---
// title: Life2D
// --- 

// flowchart TD
// Host --> Environment
// Environment --> Context
// Context --> Path
// Path --> Provider

// Provider --> Content
// Content --> Asset
// Asset --> Service
// Service --> Consumer

// Consumer --> Order
// Order --> Option
// Option --> Message
// Message --> Cipher
// ```
const Subscriptions = new Map([
    ["Presence", "presence"],
    ["Provider", ProviderAddress],
    ["Consumer", ConsumerAddress],
    ["Host", HostAddress]
])

const Host = new Map([
    ["title", "Brian Thorne's Life2d server"],
    ["summary", "Life2D,HTTP,Socket.IO,MQTT,Redis"],
    ["description", "A decentrtalized open server"],
    ["author", HostWallet.publicKey],
    ["signature", HostWallet.signMessageSync("Brian Thorne's Life2d server")],
    ["url", "127.0.0.1"],
    ["life2d", "8080"],
    ["http", "3000"],
    ["socket.io", "3333"],
    ["mqtt", "3883"],
    ["redis", "6379"],
])
const Roles = new Map([
    ["Provider", ["read", "write"]],
    ["Consumer", ["read"]],
    ["Host", ["read", "write", "delete"] ]
])
const Provider = new Map([
    ["title", "Brian Thorne"],
    ["summary", "Tire and Rim cleaning contractor"],
    ["description", "Give me a review and let me know how your wash went"],
    ["author", ProviderAddress],
    ["signature", ProviderWallet.signMessageSync("Brian Thorne")],
    ["Latitude", "33.9744648"],
    ["Longitude", "-118.29196"]
])
const Consumer = new Map([
    ["title", "Jane Doe"],
    ["summary", "Saucy and Sweet"],
    // ["description", "Give me a review and let me know how your wash went"],
    ["author", ConsumerAddress],
    ["signature", ConsumerWallet.signMessageSync("Jane Doe")],
    ["Latitude", "33.989081984233955"],
    ["Longitude", "-118.29215925769736"]
])
const Client = new Map([
    ["title", "Brian Thorne"],
    ["summary", "Tire and Rim cleaning contractor"],
    ["description", "Give me a review and let me know how your wash went"],
    ["author", ProviderAddress],
    ["publicKey", ProviderWallet.signMessageSync("Brian Thorne")],
    ["address", ProviderAddress],
    ["name", "-118.29196"],
    ["method", "-118.29196"],
    ["role", "-118.29196"],
    ["permissions", "-118.29196"],
])
const Contractor = new Map([
    ["title", "Brian Thorne"],
    ["summary", "Tire and Rim cleaning contractor"],
    ["description", "Give me a review and let me know how your wash went"],
    ["author", ProviderAddress],
    ["signature", ProviderWallet.signMessageSync("Brian Thorne")],
    ["name", "Brian Thorne"],
    ["method", "broker"]
])
const Customer = new Map([
    ["title", "Jane Doe"],
    ["summary", "Saucy and Sweet"],
    // ["description", "Give me a review and let me know how your wash went"],
    ["author", ConsumerAddress],
    ["signature", ConsumerWallet.signMessageSync("Jane Doe")],
    ["Latitude", "33.989081984233955"],
    ["Longitude", "-118.29215925769736"]
])
// Created from derived hd wallet to have the same private jey for verifcation of ownership

// Create Page Data
const Service = new Map([
    ["title", "Quick Wheel Wash"],
    ["summary", "Tire and Rim hand wash"],
    ["description", "We hand wash your rims and tires, optionally applying gloss and environmental protectant"],
    ["author", QuickWheelWashWalletAddress],
    ["signature", QuickWheelWashWallet.signMessageSync("Quick Wheel Wash")]
])
const BasicWash = new Map([
    ["title","Basic Wash"],
    ["description","Basic Wash for you"],
    ["imgSrc", "src/gifs/bucket.webp"],
    ["price","5.00"],
    ["author", QuickWheelWashWallet.deriveChild(0).address],
    ["signature", QuickWheelWashWallet.deriveChild(0).signMessageSync("Basic Wash")]
]);
const DetailedWash = new Map([
    ["title","Detailed Wash"],
    ["description","Detailed Wash for you"],
    ["imgSrc", "src/gifs/detailed.webp"],
    ["price","5.00"],
    ["author", QuickWheelWashWallet.deriveChild(1).address],
    ["signature", QuickWheelWashWallet.deriveChild(1).signMessageSync("Detailed Wash")]
]);
const ChemicalClean = new Map([
    ["title","Chemical Clean"],
    ["description","Chemical Clean on your tires"],
    ["imgSrc", "src/gifs/chemical.webp"],
    ["price","0.00"],
    ["author", QuickWheelWashWallet.deriveChild(2).address],
    ["signature", QuickWheelWashWallet.deriveChild(2).signMessageSync("Chemical Clean")]
]);
const GreenClean = new Map([
    ["title","Green Clean"],
    ["description","Green Clean on your tires"],
    ["imgSrc", "src/gifs/bucket.webp"],
    ["price","0.00"],
    ["author", QuickWheelWashWallet.deriveChild(3).address],
    ["signature", QuickWheelWashWallet.deriveChild(3).signMessageSync("Green Clean")]
]);
const CompoundClean = new Map([
    ["title","Compound Clean"],
    ["description","Compound Clean on your tires"],
    ["imgSrc", "src/gifs/sauce.webp"],
    ["price","2.50"],
    ["author", QuickWheelWashWallet.deriveChild(3).address],
    ["signature", QuickWheelWashWallet.deriveChild(3).signMessageSync("Compound Clean")]
]);
const DetailedClean = new Map([
    ["title","Detailed Clean"],
    ["description","Detailed Clean on your tires"],
    ["imgSrc", "src/gifs/polish.webp"],
    ["price","5.00"],
    ["author", QuickWheelWashWallet.deriveChild(4).address],
    ["signature", QuickWheelWashWallet.deriveChild(4).signMessageSync("Chemical Clean")]
]);

const BasicGloss = new Map([
    ["title","Basic Gloss"],
    ["description","Basic gloss on your tires"],
    ["imgSrc", "src/gifs/100.webp"],
    ["price","0.00"],
    ["author", QuickWheelWashWallet.deriveChild(5).address],
    ["signature", QuickWheelWashWallet.deriveChild(5).signMessageSync("Basic Gloss")]
]);
const MatteGloss = new Map([
    ["title","Matte Gloss"],
    ["description","Matte gloss on your tires"],
    ["imgSrc", "src/gifs/100.webp"],
    ["price","0.00"],
    ["author", QuickWheelWashWallet.deriveChild(6).address],
    ["signature", QuickWheelWashWallet.deriveChild(6).signMessageSync("Matte Gloss")]
]);
const OilGloss = new Map([
    ["title","Oil Gloss"],
    ["description","Oil gloss on your tires"],
    ["imgSrc", "src/gifs/100.webp"],
    ["price","2.50"],
    ["author", QuickWheelWashWallet.deriveChild(7).address],
    ["signature", QuickWheelWashWallet.deriveChild(7).signMessageSync("Oil Gloss")]
]);
const WetGloss = new Map([
    ["title","Wet Gloss"],
    ["description","Wet gloss on your tires"],
    ["imgSrc", "src/gifs/100.webp"],
    ["price","0.00"],
    ["author", QuickWheelWashWallet.deriveChild(8).address],
    ["signature", QuickWheelWashWallet.deriveChild(8).signMessageSync("Wet Gloss")]
]);
export const Order = new Map([
    ["title", "Customer Order"],
    ["summary", "Customer Order Quote"],
    ["author", CustomerAddress],
    ["signature", CustomerWallet.signMessageSync(CustomerWallet.signingKey.computeSharedSecret(ProviderWallet.publicKey))],
    ["amount", "5.00"],
    ["quote-date", scheduleDate],
    ["wash-type", "basic-wash"],
    ["gloss-type", "basic-gloss"],
    ["clean-type", "green-clean"],
    ["schedule-date", scheduleDate]
]);
export const CustomerOrders = new Map([
    [scheduleDate,Order]
])
const CleaningProcess = new Map([
    ["title","5 step cleaning process"],
    ["description","How to get tires and rims clean"],
    ["imgSrc", "src/gifs/200w.webp"],
    ["author", QuickWheelWashWallet.deriveChild(9).address],
    ["signature", QuickWheelWashWallet.deriveChild(9).signMessageSync("Wet Gloss")],
    ["content", "data:application/json;Preparation=string&Scrubbing=string;&Rinsing=string;&Drying=string;&Finishing=string;"],
	["Preparation", "Rinse the tires and rims with water to remove loose dirt and debris. - Apply a specialized tire and rim cleaner to break down stubborn brake dust and grime."],
	["Scrubbing","Use a soft-bristled brush or tire brush to scrub the tires and rims thoroughly, paying attention to crevices and grooves. - Apply gentle pressure to remove embedded dirt and stains without damaging the surfaces."],
	["Rinsing","Rinse the tires and rims again with clean water to remove the cleaning solution and loosened dirt. - Ensure thorough rinsing to prevent residue buildup and streaking on the surfaces."],
	["Drying","Use a clean microfiber towel to dry the tires and rims, ensuring a streak-free finish. - Pay attention to any remaining moisture in crevices or spokes to prevent water spots."],
	["Finishing","Apply a tire dressing or protectant to enhance the appearance of the tires and provide long-lasting protection against fading and cracking. - Polish the rims with a specialized wheel polish to restore shine and protect against corrosion."]
]);

const ServiceOptionWashType = new Map([
    ["title", "Wash Type"],
    ["summary", "Wash Type Options"],
    ["author", QuickWheelWashWalletAddress],
    ["signature", QuickWheelWashWallet.signMessageSync("Quick Wheel Wash/Working Schedule")],
    ["basic-wash", "5"],
    ["detailed-wash", "20"]
]);
const ServiceOptionGlossType = new Map([
    ["title", "Gloss Type"],
    ["summary", "Gloss Type Options"],
    ["author", QuickWheelWashWalletAddress],
    ["signature", QuickWheelWashWallet.signMessageSync("Quick Wheel Wash/Working Schedule")],
    ["basic-gloss", "0"],
    ["matte-gloss", "0"],
    ["oil-gloss", "1"],
    ["wet-gloss", "1"]
]);
const ServiceOptionCleanType = new Map([
    ["title", "Clean Type"],
    ["summary", "Clean Type Options"],
    ["chemical-clean", "0"],
    ["green-clean", "0"],
    ["compound-clean", "5"],
    ["detailed-clean", "10"]
]);
// Create page chat data
const ServiceProvider = new Map([
    ["title", "Quick Wheel Wash"],
    ["summary", "Wash Estimate"],
    ["author", ProviderAddress],
    ["signature", ProviderWallet.signMessageSync(`Quick Wheel Wash/Order/${scheduleDate}/${ProviderAddress}`)],
    [addTime(new Date(startDate), 0, 0, 30), "Hey, How can I help you today?"],
    [addTime(new Date(startDate), 0, 0, 33), "a Basic Wash, Matte Gloss, Basic Clean\nOkay, what time are you interested in?"],
    [addTime(new Date(startDate), 0, 0, 35), "Yes, I'm available for that service at that time, please confirm"],
    [addTime(new Date(startDate), 0, 0, 38), "I recived your confirmation and will start at " + scheduleDate]
]);
const ServiceProviderSchedule = new Map([
    ["title", "Working Schedule"],
    ["summary", "Quick Wheel Wash Working Schedule"],
    ["author", QuickWheelWashWalletAddress],
    ["signature", QuickWheelWashWallet.signMessageSync("Quick Wheel Wash/Working Schedule")],
    [startDate.toUTCString(), HostAddress],
    [addTime(startDate, 0, 0, 30), ProviderAddress],
    [addTime(startDate, 0, 1), ConsumerAddress],
    [addTime(startDate, 0, 1, 30), ""],
    [addTime(startDate, 0, 2), ""],
    [addTime(startDate, 0, 2, 30), ""],
    [addTime(startDate, 0, 3), ""],
    [addTime(startDate, 0, 3, 30), ""],
    [addTime(startDate, 0, 4), ""],
    [addTime(startDate, 0, 4, 30), ""]
]);
const ServiceConsumer = new Map([
    ["title", "Quick Wheel Wash"],
    ["summary", "Wash Estimate"],
    ["author", ConsumerAddress],
    ["signature", ConsumerWallet.signMessageSync("Quick Wheel Wash")],
    [addTime(new Date(startDate), 0, 0, 31), "I would like a quote"],
    [addTime(new Date(startDate), 0, 0, 31, 30), "Basic Wash, Matte Gloss, Basic Clean,"],
    [addTime(new Date(startDate), 0, 0, 34), scheduleDate],
    [addTime(new Date(startDate), 0, 0, 37), ConsumerWallet.signMessageSync(scheduleDate)],
    [addTime(new Date(startDate), 0, 0, 39), "Thank you, give me updates."],
]);
const ServiceCustomer = new Map([
    ["title", "Purchase Order"],
    ["summary", "Purchase Order Quote"],
    ["author", ConsumerAddress],
    ["signature", ConsumerWallet.signMessageSync(`Quick Wheel Wash/Order/${ConsumerAddress}/${scheduleDate}`)],
    ["amount", "5.00"],
    ["quote-date", scheduleDate],
    ["wash-type", "basic-wash"],
    ["gloss-type", "basic-gloss"],
    ["clean-type", "green-clean"],
    ["schedule-date", scheduleDate]
]);

const ServiceContractor = new Map([
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
]);
const ServiceOrder = new Map([
    ["title", "Order State"],
    ["summary", "state of current order"],
    ["author", QuickWheelWashWalletAddress],
    ["signature", QuickWheelWashWallet.signMessageSync(`Quick Wheel Wash/Order/${scheduleDate}`)],
    ["provider", ProviderAddress],
    ["consumer", ConsumerAddress]
]);
const ServiceContract = new Map([
    ["title", "Order State"],
    ["summary", "state of current order"],
    ["author", QuickWheelWashWalletAddress],
    ["signature", QuickWheelWashWallet.signMessageSync(`Quick Wheel Wash/Order/${scheduleDate}`)],
    ["provider", ProviderAddress],
    ["consumer", ConsumerAddress]
]);
const ServiceStatus = new Map([
    ["title", "Order State"],
    ["summary", "state of current order"],
    ["author", QuickWheelWashWalletAddress],
    ["signature", QuickWheelWashWallet.signMessageSync(`Quick Wheel Wash/Order/${scheduleDate}/${QuickWheelWashWalletAddress}`)],
    ["provider", ProviderAddress],
    ["consumer", ConsumerAddress],
    [scheduleDate, "Order Recieved"],
    [addTime(new Date(scheduleDate), 0, 0, 1), "Order Dispatched"],
    [addTime(new Date(scheduleDate), 0, 0, 2), "Work Started"],
    [addTime(new Date(scheduleDate), 0, 0, 5), "First Wheel Complete"],
    [addTime(new Date(scheduleDate), 0, 0, 5, 30), "New Image Added"],
    [addTime(new Date(scheduleDate), 0, 0, 17), "Order Complete"]
]);
// Create page order data

// export { Host , OnlineHost, ServerPort, SocketIOPort, MosquitoPort, ReactPort, RedisPort}
export { Host, Provider,Consumer }
export {
    Service as QuickWheelWash,
    ServiceProviderSchedule as ServiceProviderWorkingSchedule,
    ServiceOptionWashType,
    ServiceOptionGlossType,
    ServiceOptionCleanType,
    ServiceStatus as ServiceStatus,
    ServiceProvider as ServiceProviderToConsumer,
    ServiceConsumer as ServiceConsumerToProvider,
    ServiceOrder as ServiceAgreement,
    ServiceCustomer as ServiceOrder,
    ServiceContractor as ServiceContract,
    ServiceContract as ServiceConfirmation,
    Subscriptions
}
export {
    BasicWash,
    DetailedWash,
    ChemicalClean,
    GreenClean,
    CompoundClean,
    DetailedClean,
    BasicGloss,
    MatteGloss,
    OilGloss,
    WetGloss
}

