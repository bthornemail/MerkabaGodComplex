/* eslint-disable @typescript-eslint/no-explicit-any */

const brianThorne = new Map([
  ["identity", "brian-thorne"],
  ["address", "0xe7AF4FcdB724a74a8675686DaA8B71294395EFE3"],
  ["privateKey", "0x00e3aaf2351d9465c0f53619f75d21d93a43b51562a8bdf5ed63b64b98c57df3"],
  ["fingerprint", "0x8c9da242"],
  ["mnemonic", "grant quarter pipe blur shadow step wire south unhappy hammer desk awesome"],
  ["encrypted", `{"address":"e7af4fcdb724a74a8675686daa8b71294395efe3","id":"b6cfaa2f-8b61-4218-b8b9-2bfa55e24bf3","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"61982190825a049573386eef640d4488"},"ciphertext":"1d827a3b513c673c17c4b17016949790d284ac696f2c056cf9f4e37641343129","kdf":"scrypt","kdfparams":{"salt":"ec792bf3a4204b98cc7a9a94beae49c69551ee599d5c1f7bc28dae6804d3b838","n":131072,"dklen":32,"p":1,"r":8},"mac":"276fe74ec17ff4d5fc89364882206e92eff41d8e3b7540386217789db353042e"},"x-ethers":{"client":"ethers/6.11.1","gethFilename":"UTC--2024-04-19T13-18-25.0Z--e7af4fcdb724a74a8675686daa8b71294395efe3","path":"m/44'/60'/0'/0/0","locale":"en","mnemonicCounter":"fce14adb07032b742c7e39f19793dabe","mnemonicCiphertext":"1b2082b63470f7e0c95c20a08b9bde12","version":"0.1"}}`],
])
const marketplace = new Map([
  ["provider", "null"],
  ["address", '0x9A7B385B5700186C78FD403f59a5b42bfcb088Ee'],
  ["privateKey", '0xcadcbcdafaef5098940e08072c55f40e438aac33b5218564c4d100b9cf11eff8'],
  ["publicKey", '0x037e38c5362401f8ccbd32347acc5e45df20cc8c4ea6e482b7bb7318209551e5d2'],
  ["fingerprint", '0xde45d329'],
  ["parentFingerprint", '0x732879cb'],
  ["mnemonic", 'isolate web wisdom stuff quick horn pave badge vendor blade cake quality'],
  ["encrypted", `{"address":"9a7b385b5700186c78fd403f59a5b42bfcb088ee","id":"f14efee6-20c8-4a4c-a38c-c0554de553dc","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"3f7131dfcea648f9a18829c22e83d846"},"ciphertext":"4420dd0a7126bf3ae3e669121d8a2e28fc286195fe4bb925d9e71b353c9a2c10","kdf":"scrypt","kdfparams":{"salt":"d58407f2fb732b2857208e3566fd8184fcb825a6ca61413b72dff05b592fc92d","n":131072,"dklen":32,"p":1,"r":8},"mac":"c194b004b5eb33a42e848d35cbb3351281dbed36841a0073fbc3074e7dd44864"},"x-ethers":{"client":"ethers/6.11.1","gethFilename":"UTC--2024-04-19T13-35-40.0Z--9a7b385b5700186c78fd403f59a5b42bfcb088ee","path":"m/44'/60'/0'/0/0","locale":"en","mnemonicCounter":"2c9cdaf80cd432c9b8c5214697b0ddfb","mnemonicCiphertext":"ed04d8d78dc4023a1a555ae13f82b2bb","version":"0.1"}}`]
]);
const deliveryForLocals = new Map([
  ["identity", "deliverforlocals.com"],
  ["address", "0x251B32BbEB842e988951E5B574Fd6589981b0982"],
  ["privateKey", "0x1f51c298715292a3725997743420e9fe059abb15b3ef882cfccba216636616ff"],
  ["fingerprint", "0xb6408129"],
  ["mnemonic", "beyond share hair bottom half isolate soul client humble turn ridge spy"],
  ["encrypted", `{"address":"251b32bbeb842e988951e5b574fd6589981b0982","id":"261eb6bf-3885-49d4-8570-ac3907e1d77f","version":3,"Crypto":{"cipher":"aes-128-ctr","cipherparams":{"iv":"7b09d3d664687dfc4e3f46dac3a139a5"},"ciphertext":"8ac53b9336585dd3a74ed8c7059fe107df8f1c295e5833d55d92bb725d9db28b","kdf":"scrypt","kdfparams":{"salt":"9c6af6ac5096317b43e3a80f7f2bd32764f839aa2704c6af796d3b7073123092","n":131072,"dklen":32,"p":1,"r":8},"mac":"1bb7ea8250e354da44464448c4a61cb585128bebaae4a192946ca6606c08e6b6"},"x-ethers":{"client":"ethers/6.11.1","gethFilename":"UTC--2024-04-19T13-32-40.0Z--251b32bbeb842e988951e5b574fd6589981b0982","path":"m/44'/60'/0'/0/0","locale":"en","mnemonicCounter":"f04875d7ac258604fa45a558ac2a6b8a","mnemonicCiphertext":"1e896f56277464aac826fabada03a2ba","version":"0.1"}}`], //password:password ,
  ["home", "home-id"],
  ["title", "deliveryforlocals.com"],
  ["summary", "Food Delivery for Leimert Park Locals"],
  ["description", "All inclusive flat fee food delivery service"],
  ["locations", [
    "Taco Mels Catering and Restaurant",
    "El Pollo Loco",
    "Pizza Hut",
    "Pizza Hut",
    "Dulans on Crenshaw",
    "Delicious Southern Cusine",
    "Mc Donalds",
    "Melissa's Catering",
    "Jack-In-The-Box",
    "Taco Bell",
    "Rally's",
    "Panda Express ",
    "Chile Verde",
    "Orelans and York",
    "Wingstop",
    "Winenerschinitzel",
    "Tacos el Pachi",
    "Dennys",
    "The Meltdows ",
    "Ramonas Mexican Food"
  ].join()]
]);

// const deliveryForLocalsLocation = new Map<string, string | number>([
//   ["identity", "locations"],
//   ["locations", "list"],
//   ["Taco Mels Catering and Restaurant", 0],
//   ["El Pollo Loco", 0],
//   ["Pizza Hut", 0],
//   ["Pizza Hut", 0],
//   ["Dulans on Crenshaw", 0],
//   ["Delicious Southern Cusine", 0],
//   ["Mc Donalds", 0],
//   ["Melissa's Catering", 0],
//   ["Jack-In-The-Box", 0],
//   ["Taco Bell", 0],
//   ["Rally's", 0],
//   ["Panda Express ", 0],
//   ["Chile Verde", 0],
//   ["Orelans and York", 0],
//   ["Wingstop", 0],
//   ["Winenerschinitzel", 0],
//   ["Tacos el Pachi", 0],
//   ["Dennys", 0],
//   ["The Meltdows ", 0],
//   ["Ramonas Mexican Food", 0]
// ]);
export default new Map<string, any>([
  ['identity', brianThorne.get("identity")],
  ["address", brianThorne.get("address")],
  
  ['', deliveryForLocals.get("home")],
  ["marketplace2d.com", marketplace.get("marketplace2d.com")],
  
  ["deliveryforlocals.com", deliveryForLocals.get("deliveryforlocals.com")],
  ["deliveryforlocals.com/list/locations", deliveryForLocals.get("locations")],
  ["deliveryforlocals.com/order/taco-mells/flat-fee-delivery", deliveryForLocals.get("flat-fee-delivery")],
  ["deliveryforlocals.com/order/taco-mells/keisha-thorne", deliveryForLocals.get("keisha-thorne")]
])