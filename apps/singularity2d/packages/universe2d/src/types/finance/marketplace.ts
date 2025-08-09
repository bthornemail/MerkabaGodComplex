

// For login
type ADDRESS = string;
type PASSWORD = string;
type PATH = string;

type CONSUMER = string;

type WASH = "Basic" | "Detailed";
type GLOSS = "Matte" | "Gloss" | "Wet" | "Oil";
type CLEAN = "Chemical" | "Green" | "Compound" | "Detail";
type SCHEDULED_DATE = string;

type NAME = string;
type METHOD = string;
type CONTACT = string;
type SMS = string;
type MQTT = string;
type FILE = string;

// Root Types
type _Value = number;
type _Rating = number | number[] | number[][];
type _CryptoKey = number;
type _CryptoAddress = number;
type _ZeroCryptoAddress = 0x0;
type _Asset = _Token;
type _DateTime = string;
type _URL = string;
//a currency number
type _Amount = number; 
//Smart contract protocol
type _ERC115 = {
    address: number
} 
//Smart contract protocol for fungible tokens
type _ERC20 = {
    address: number
} 
//Smart contract protocol for non-fungible tokens
type _ERC720 = {
    address: number
}
// a smart contract reruns a fucntion that can be caled whenn voked or if has paramater reutrns mony
type _SmartContract = (tokens?: _Token)=>(smartContracts: _SmartContract[])=>any | null | boolean;
//a json remote communication specification
type _JSONRPC = {};

// A standrad token no fungible tokesn have a value of 1
type _Token = {
    address: _CryptoAddress,
    value: _Value
}
// a standartd crypto currency wallet
type _Wallet = {
    privateKey: _CryptoKey,
    publicKey: _CryptoKey,
    getAddress: ()=>_CryptoAddress
} 

// a claim that is regulated by smart contract
type _Claim = _ERC720 & _SmartContract;

type _RemittedClaim = (claim: _Claim)=>_Token[];

// a claim that is executed by delegated key holder 
type _EscrowClaim = _Claim;

// a claim attached to a nft
type _StakedClaim = {
    expires: ()=>{}
} & _Claim;


/*
al user created typescript types are started with and "_"
*/
declare type ETHERS_WALLET_ADDRESS = string
declare type CIDv1 = string
declare type SIGNATURE = string

type ASSET  = {
	name: string
	registration: CIDv1
}
type REGISTRATION = {
	asset: ASSET
	signature: SIGNATURE
}

type TRADE = { 
	to: ETHERS_WALLET_ADDRESS
	from: ETHERS_WALLET_ADDRESS
	asset: ASSET
}
type LOAN = {
	wallet: ETHERS_WALLET_ADDRESS
	asset: ASSET
}
import './protocol.types.ddd';

type _ContractorProtocol = _ERC115;



type _Contractor = { 
    accessValue: _Value,
    accessRating: _Rating
} & _Wallet;

interface IStakeClaim {
    stakeClaim: (address: _CryptoAddress, tokens: _Token)=>_StakedClaim
}
// Sponsors can stake claims for others in escrow
type _Sponsor = { 
    accessValue: _Value,
    accessRating: _Rating
} & _Wallet;

interface ISponsorClaims {
    sponsorClaim: (address: _CryptoAddress, tokens: _Token)=>_EscrowClaim
}
import './protocol.types.ddd';

type _ServiceProtocol = _ERC115;

// A JSON RPC call to request services
type _Service = {
    description: _Service[],
    requirements: string[]
} & _ERC720;

//A client to the platfomr able to inerent fiat curreceny for paye=ments
type _Consumer = {
    name: string
} & _Wallet;

// a claim that is executed by service key 
type _ServiceClaim = _EscrowClaim;

type _ServiceRequest = {
    //reques params
    to: _CryptoAddress | _ZeroCryptoAddress,
    dateRange: [_DateTime,_DateTime],
    services: _Service[],
    budget?: _Value
} & _JSONRPC;

type _CompletedService = {
    //ratings are based on rating description and services requested
    ratings: number[][]
} & _Service;

interface IRequestServicePerformed {
    requestServiceRequest: (serviceRequest: _ServiceRequest)=> _ServiceDetails | _ServiceDenial
};
interface IResolveServiceRendered {
    acceptServiceRequest: (serviceRequest: _ServiceRequest)=> _ServiceDetails | _ServiceDenial
};
type _ServiceDetails =  _ServiceDetail[];

type _ServiceDetail = string | _URL | _SmartContract;
type _ServiceDenial = string;
type _ServiceResult = {rating: _Rating }

// Equipment
import './protocol.types.ddd';

type _EquipmentProtocol = _ERC115;
// a entity that has an can mint, can hold, can destory equipment tokens, can mint and hold smart contracs
type _SharedEquipmentProvider = {} & _Wallet;
type _Inventory = _StakedAsset;

// an asset with required parameter to be fullfillable
type _StakedAsset = {
    expires: ()=>{}
} & _Asset;


// equipment is a high level type of whats offered by equipment providers
type _Equipment = {
    accessRating: _Rating,
    condition: _Rating,
    rentalFee: _Amount
} & _StakedAsset;

interface IStakeAssets {
    // inventory: (address: _CryptoAddress)=>_Inventory,
    stakeAsset: (value: _Value, equipment: _Equipment)=>_StakedClaim & _StakedAsset,
    forfeitAsset: (_StakedClaim)=>_RemittedClaim
}
interface IRentEquipment {
    // inventory: (address: _CryptoAddress)=>_Inventory,
    rent: (address: _CryptoAddress, equipment: _Equipment)=>_EscrowClaim | _RentalReciept,
    remit: (address: _CryptoAddress, equipment: _Equipment)=>_RemittedClaim | _RentReciept
}
// contractor recieves rental reciept whic is a smart contract address for contractor rental
type _RentalReciept = {}
// contractor recieves rent reciept when rental is retured
type _RentReciept = {}
