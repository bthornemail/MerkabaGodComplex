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
