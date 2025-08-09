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