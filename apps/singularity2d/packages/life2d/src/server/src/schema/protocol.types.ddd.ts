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