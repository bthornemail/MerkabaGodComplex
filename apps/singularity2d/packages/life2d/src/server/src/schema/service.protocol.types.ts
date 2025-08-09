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