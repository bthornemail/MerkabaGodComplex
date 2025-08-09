/* eslint-disable @typescript-eslint/no-explicit-any */
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import useAccount from './hooks/useAccount';
import "./App.css"
import useDataMap from "./hooks/useDataMap";
import useNetwork from './hooks/useNetwork';
import { Wallet } from "ethers";

export const marketplaceWallet = {
  provider: null,
  address: '0x9A7B385B5700186C78FD403f59a5b42bfcb088Ee',
  privateKey: '0xcadcbcdafaef5098940e08072c55f40e438aac33b5218564c4d100b9cf11eff8',
  publicKey: '0x037e38c5362401f8ccbd32347acc5e45df20cc8c4ea6e482b7bb7318209551e5d2',
  fingerprint: '0xde45d329',
  parentFingerprint: '0x732879cb',
  mnemonic: 'isolate web wisdom stuff quick horn pave badge vendor blade cake quality',
  // encrypted: `{"address":"9a7b385b5700186c78fd403f59a5b42bfcb088ee","id":"f14efee6-20c8-4a4c-a38c-c0554de553dc","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"3f7131dfcea648f9a18829c22e83d846"},"ciphertext":"4420dd0a7126bf3ae3e669121d8a2e28fc286195fe4bb925d9e71b353c9a2c10","kdf":"scrypt","kdfparams":{"salt":"d58407f2fb732b2857208e3566fd8184fcb825a6ca61413b72dff05b592fc92d","n":131072,"dklen":32,"p":1,"r":8},"mac":"c194b004b5eb33a42e848d35cbb3351281dbed36841a0073fbc3074e7dd44864"},"x-ethers":{"client":"ethers/6.11.1","gethFilename":"UTC--2024-04-19T13-35-40.0Z--9a7b385b5700186c78fd403f59a5b42bfcb088ee","path":"m/44'/60'/0'/0/0","locale":"en","mnemonicCounter":"2c9cdaf80cd432c9b8c5214697b0ddfb","mnemonicCiphertext":"ed04d8d78dc4023a1a555ae13f82b2bb","version":"0.1"}}`
}
export const bthorneWallet = {
  provider: '0x7b64e695d9f8ad9369589641775d04a215a5baa669a90a7a914486579384b82860bd2d8eba6fb11e9e180c7f49dc351d62ceeb44d177f2131921fb0aa69c97651b',
  address: '0x7b13b2CFC22963EbC14B2D5c27d3aD44fa59A946',
  privateKey: '0x99174689f6760d5acef5b99c79eed81ef44dec8016c71df295e5448ae0f36abe',
  publicKey: '0x02985d030ca7fd8a75bba52ff018aee6cdac329b65607ffc3b28217e3140fa2fd8',
  fingerprint: '0x7543f74b',
  parentFingerprint: '0x1746562d',
  mnemonic: 'real clinic agent waste multiply laugh pill crane art daring spice steel',
  // encrypted: `{"address":"7b13b2cfc22963ebc14b2d5c27d3ad44fa59a946","id":"4108ec00-fd1c-4f42-9939-ef11d9e9bae7","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"e45c0be1666a1654da609c062d33b4e5"},"ciphertext":"571dfeed32eebace12eb86bb090fe29e6fc76be91ca9086c76d8bc678c0e57c0","kdf":"scrypt","kdfparams":{"salt":"50a9aee11e97ecedbdd9666d491755df5d776f450d5418b78f6a891fad9d21a7","n":131072,"dklen":32,"p":1,"r":8},"mac":"baa9b19dde460703516012153b8f299f2f0da9d0c5b1cbb30fa227a01d711ea5"},"x-ethers":{"client":"ethers/6.11.1","gethFilename":"UTC--2024-04-19T13-25-40.0Z--7b13b2cfc22963ebc14b2d5c27d3ad44fa59a946","path":"m/44'/60'/0'/0/0","locale":"en","mnemonicCounter":"7fdce4ce0c07f04205265d47ebd3add7","mnemonicCiphertext":"3887460307f0d4fb4287107f66dbbec5","version":"0.1"}}` //password:password
}
export const deliveryforlocalsWallet = {
  provider: '0xad60dae6e6eee33d9daed7546531c9c0c3caf756bf39bfed7031eaa735e55120522c60f1de8c26b1436a56bd85dde335d31831a940ce401a16e991049d6718b71b', //signature from this address signed by brian thorne wallet
  address: '0x251B32BbEB842e988951E5B574Fd6589981b0982',
  privateKey: '0x1f51c298715292a3725997743420e9fe059abb15b3ef882cfccba216636616ff',
  publicKey: '0x035ec1db3007d00e053cdd638e3d78659098140ad7d0b3c2b8d8c7151964cff4cd',
  fingerprint: '0xb6408129',
  parentFingerprint: '0x2778f2c6',
  mnemonic: 'beyond share hair bottom half isolate soul client humble turn ridge spy',
  // encrypted: `{"address":"251b32bbeb842e988951e5b574fd6589981b0982","id":"261eb6bf-3885-49d4-8570-ac3907e1d77f","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"7b09d3d664687dfc4e3f46dac3a139a5"},"ciphertext":"8ac53b9336585dd3a74ed8c7059fe107df8f1c295e5833d55d92bb725d9db28b","kdf":"scrypt","kdfparams":{"salt":"9c6af6ac5096317b43e3a80f7f2bd32764f839aa2704c6af796d3b7073123092","n":131072,"dklen":32,"p":1,"r":8},"mac":"1bb7ea8250e354da44464448c4a61cb585128bebaae4a192946ca6606c08e6b6"},"x-ethers":{"client":"ethers/6.11.1","gethFilename":"UTC--2024-04-19T13-32-40.0Z--251b32bbeb842e988951e5b574fd6589981b0982","path":"m/44'/60'/0'/0/0","locale":"en","mnemonicCounter":"f04875d7ac258604fa45a558ac2a6b8a","mnemonicCiphertext":"1e896f56277464aac826fabada03a2ba","version":"0.1"}}` //password:password 
}
export const marketplace = new Wallet(marketplaceWallet.privateKey)
export const brianThorne = new Wallet(bthorneWallet.privateKey)
export const deliveryForLocals = new Wallet(deliveryforlocalsWallet.privateKey)
export default function Router() {

  const { address, provider, consumer, observerMap } = useAccount(brianThorne.signMessageSync(marketplace.address))
  const record = useDataMap(observerMap)
  const network = useNetwork(record)
  console.log({ address, provider, consumer, observerMap })
  console.log({ record })
  console.log({ network })

  return (<BrowserRouter>
    <div className='app'>
      <div className='nav'>
        {Array.from(observerMap.entries()).map((element, index) => {
          return <button key={index} className='btn btn-sm btn-outline-primary'>
            <Link to={element[0]} className='link-btn'>
              {index == 0 ?
                "home"
                : element[0].split("/").length >= 2
                  ? [
                    element[0].split("/")[0],
                    element[0].split("/")[element[0].split("/").length - 1]
                  ].join("/")
                  : element[0]}
            </Link>
          </button>
        })}
      </div>
      <div className='main'>
        <Routes>
          {Array.from(observerMap.entries()).map((element, index) => {
            return <Route key={index} path={element[0]} element={element[1]} />
          })}
        </Routes>
      </div>
    </div>
  </BrowserRouter>)
}