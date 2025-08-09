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