import { CID } from 'multiformats/cid'
import { Multiaddr } from '@multiformats/multiaddr'
import VmNode from '../components/Nodes/VM.Node.js'
import WebWorkerNode from '../components/Nodes/Web.Worker.Node.js'
import BlockNode from '../components/Nodes/Block.Node.js'
import HeliaWorkerNode from '../components/Nodes/Helia.Worker.Node.js'
import { PeerId } from '@libp2p/interface/peer-id'
import { KeyLike } from 'node:crypto'
// import { AddressLike, HDNodeWallet } from 'ethers'
import { AddressLike, HDNodeWallet, SignatureLike } from 'ethers'
import BlockchainNode from '../components/Nodes/Blockchain.Node.js'
import HTTPWorkerNode from '../components/Nodes/HTTP.Worker.Gateway.js'
import ProtocolNode from '../components/Nodes/Protocol.Gateway.js'
import WeloNode from '../components/Nodes/Welo.Gateway.js'
import CLINode from '../components/Interfaces/CLI.Interface.js'
import REPLNode from '../components/Interfaces/REPL.Interface.js'
import StreamingNode from '../components/Nodes/Streaming.Node.js'
import Blockchain from '../components/Nodes/Blockchain.js'
import SystemNode from '../components/Nodes/System.Node.js'
import Node from '../components/Nodes/Node.js'
import { Readable, Writable } from 'node:stream'

export { Node, BlockNode, HTTPWorkerNode, ProtocolNode, VmNode, WebWorkerNode, WeloNode, HeliaWorkerNode }
export type VAULT_AI_STREAMING_NODE = StreamingNode
export type VAULT_AI_NODE = VAULT_AI_PUBLIC_NODE | VAULT_AI_PRIVATE_NODE
export type VAULT_AI_PUBLIC_NODE = ProtocolNode | HTTPWorkerNode | BlockchainNode<{ title: string, summary: string, command: string }>
export type VAULT_AI_PRIVATE_NODE = SystemNode | Blockchain<any> | CLINode | REPLNode | VmNode | WebWorkerNode | HeliaWorkerNode
export interface PIPEABLE { input?: Readable, output?: Writable, errored?: Error }

export interface MENU_OPTION {
  input?: string[]
  output?: string[]
  command: MENU_OPTION_COMMAND
  name: string
  summary: string
}
// eslint-disable-next-line etc/prefer-interface
export type MENU_OPTION_COMMAND = (any?: any) => Promise<any>
export interface START_MENU_PROPS {
  title: string
  summary?: string
  description?: string
  menu?: MENU_OPTION[]
  alert?: string
}
export interface BLOCK_TYPE<METADATA_TYPE> {
  cid: CID
  metadata: METADATA_TYPE
}
export interface CHAINABLE_BLOCK_TYPE<METADATA_TYPE> extends BLOCK_TYPE<METADATA_TYPE> {
  previousCID: CID | null
  timestamp: number
}

export interface AUTHORED_BLOCK_TYPE<METADATA_TYPE> extends CHAINABLE_BLOCK_TYPE<METADATA_TYPE> {
  index: number
  timestamp: number
  signature: string
}

// export interface BLOCK_CHAIN_TYPE<BLOCK_TYPE, METADATA_TYPE> {
//   blocks: BLOCK_TYPE[]
//   chainId: string
//   genesisBlock: BLOCK_TYPE
// }

export interface VM_SCRIPT_FUNCTION<INPUT_TYPE, OUTPUT_TYPE> {
  name: string
  description: string
  inputs: INPUT_TYPE[]
  outputs: OUTPUT_TYPE[]
  code: string
}
export interface VM_SCRIPT_FUNCTION_INPUT_ARGUMENT {
  name: string
  value: null | boolean | object | Array<boolean | object | number | string> | number | string
  type: 'null' | 'boolean' | 'object' | 'array' | 'number' | 'string'
}
export interface VM_SCRIPT_FUNCTION_OUTPUT_VALIDATOR {
  name?: string
  type: 'null' | 'boolean' | 'object' | 'array' | 'number' | 'string'
  assert: '==' | '===' | '!=' | '!==' | '>' | '<' | '>=' | '<=' | '&&' | '||' | 'true' | 'false' | 'ok' | 'error' | 'success'
  value: null | boolean | object | Array<boolean | object | number | string> | number | string
}

export interface VAULT_AI_OUTPUT_VALIDATOR {
  name: string
  type: 'null' | 'boolean' | 'object' | 'array' | 'number' | 'string'
  assert: '==' | '===' | '!=' | '!==' | '>' | '<' | '>=' | '<=' | '&&' | '||' | 'true' | 'false' | 'ok' | 'error' | 'success'
  value: null | boolean | object | Array<boolean | object | number | string> | number | string
}
interface JsonSchema {
  title?: string
  description?: string
  type?: string | string[]
  properties?: Record<string, JsonSchema>
  required?: string[]
  items?: JsonSchema | JsonSchema[]
  minLength?: number
  maxLength?: number
  minimum?: number
  maximum?: number
  // More properties can be added as needed
}
export interface VM_SCRIPT_FUNCTION_PARAMS {
  functionName: string
  input: JsonSchema
  output: JsonSchema
  sourceCode: string
}
export interface NODE_DOMAIN {
  name: string
  peerId?: PeerId
  address?: AddressLike
  multiaddrs?: Multiaddr[]
}
export interface VAULT_OPTIONS {
  user?: any
  name: string
  wallet?: HDNodeWallet
  publicKey?: KeyLike
  privateKey?: any
  //   account?: any,
}

export interface VAULT_AI_COMMAND {
  name: string
  arguments?: string[]
  command: string
}
export interface VAULT_AI_BLOCK {
  index: number
  cid: string
  metadata: Record<string, null | boolean | object | Array<boolean | object | number | string> | number | string | Record<string, null | boolean | object | Array<boolean | object | number | string> | number | string>>
  embeddinsgs: number[]
}
export interface NODE_OPTIONS {
  name: string
  wallet?: HDNodeWallet
  peerId?: PeerId
  tcpPort?: number
  wsPort?: number
}
export interface SYSTEM_OPTIONS {
  // name: string
  wallet?: HDNodeWallet
  publicKey?: KeyLike
  signature?: SignatureLike
  privateKey?: KeyLike
}

export interface SYSTEM_START_OPTIONS {
  // name: string
  type?: string
  title: string
  summary?: string
  description?: string
}
// Official Blocks

export interface PackageManifest {
  manifestCID: string
  packages: string[]
}
export interface Transaction {
  sender: string
  receiver: string
  amount: number
}
export interface CHAT_MESSAGE {
  role: string
  receiver: string
  amount: number
}
export interface Contract {
  contractId: string
  parties: string[]
  details: string
}
export interface VMFunction {
  functionName: string
  arguments: VM_SCRIPT_FUNCTION_INPUT_ARGUMENT[]
  returnTypes: VM_SCRIPT_FUNCTION_OUTPUT_VALIDATOR[]
  sourceCode: string
}

export interface CIDData {
  description: string
  cid: string
}

export interface Protocol {
  name: string
  versions: string[]
}

export interface ProtocolAddress {
  environment: string | SystemConfiguration | CID | Multiaddr | iPackageManifest // Environment protocol (e.g., /ubuntu/20.40/Kernel...)
  address: Multiaddr // Communication address (e.g., /tcp/127.0....)
}
export interface SystemConfiguration {
  os: string
  version: string
  hardware: {
    cpu: string
    ram: string
    gpu: string
  }
  environmentVariables: Record<string, string>
}

export interface iResourcePool {
  topicID: string
  associatedManifest: string
  subscribers: string[]
  consensusResults: Array<{
    functionCID: string
    efficiencyScore: number
  }>
}

export interface iResourcePoolInvite {
  poolID: string
  associatedFunction: string
  peers: string[]
}

export interface iReview {
  reviewerWalletAddress: string
  associatedFunctionOrPackage: string
  rating: number
  comment: string
}

export interface iSearch {
  searchTerm: string
  results: string[]
}

export interface iPackageManifest {
  manifestCID: string
  packages: string[]
}
export interface iPackagePublication {
  packageCID: string
  packageName: string
  description: string
  version: string
  authorWalletAddress: string
  signature: string
  associatedBranch: string
  tags: string[]
}

export interface VMScriptSchema {
  vmFunction: VMFunction
  associatedData: CIDData[]
  protocols: Protocol[]
  packageManifest: iPackageManifest
  systemConfiguration: SystemConfiguration
}

// Block export interface
export interface iBlock {
  blockCID: string
  previousBlockCID: string
  timestamp: string // Alternatively, you can use 'Date' if you want a date object
  authorWalletAddress: string
  editData: Record<string, unknown> // If you have a more specific structure for editData, replace this.
  signature: string
}

// Branch export interface
export interface iBranch {
  branchName: string
  blocks: string[]
  latestBlockCID: string
  associatedFunctionOrManifest: string
}

// Execution Block export interfaceS
export interface ExecutionBlock {
  blockCID: string
  executionTime: number
  inputOutputCompatibility: string
}
export interface iBlockChain {
  blocks: ExecutionBlock[]
}
export interface BLOCK {
  // A block is the data and the sigining of the data
  signture: string // Address of the author
  //   editData: Record<string, unknown> // execution block protocol
  //   signature: string
  //   executionTime: number
  data: any // Storing the VM script function data
}
export interface CHAINABLE_BLOCK {
  index: string
  timestamp: number
  blockCID: CID // CID hash of the block itself
  previousBlockCID: CID // CID hash of the previous block
}
export const Block = {
  type: 'object',
  properties: {
    blockCID: {
      type: 'string',
      description: 'Unique identifier for this block (e.g., its CID in IPFS).'
    },
    previousBlockCID: {
      type: 'string',
      description: 'CID of the previous block in the chain.'
    },
    timestamp: {
      type: 'string',
      format: 'date-time',
      description: 'Timestamp of when this block was created.'
    },
    authorWalletAddress: {
      type: 'string',
      description: 'Ethereum wallet address of the user who made the edit.'
    },
    editData: {
      type: 'object',
      description: 'Data related to the edits made in this block.'
    },
    signature: {
      type: 'string',
      description: "Signature from the author's wallet, verifying the authenticity of the block."
    }
  },
  required: ['blockCID', 'previousBlockCID', 'timestamp', 'authorWalletAddress', 'editData', 'signature']
}
export const Branch = {
  type: 'object',
  properties: {
    branchName: {
      type: 'string',
      description: 'Name or identifier for this branch.'
    },
    blocks: {
      type: 'array',
      description: 'Ordered list of block CIDs in this branch, from oldest to newest.',
      items: {
        type: 'string'
      }
    },
    latestBlockCID: {
      type: 'string',
      description: 'CID of the latest block in this branch.'
    },
    associatedFunctionOrManifest: {
      type: 'string',
      description: 'CID of the function or manifest associated with this branch.'
    }
  },
  required: ['branchName', 'blocks', 'latestBlockCID', 'associatedFunctionOrManifest']
}
export const BlockSchema = {
  type: 'object',
  properties: {
    blockCID: {
      type: 'string',
      description: 'CID of the execution block.'
    },
    executionTime: {
      type: 'number',
      description: 'Time taken for execution.'
    },
    inputOutputCompatibility: {
      type: 'string',
      description: 'Compatibility hash or metric of the input-output pair.'
    }
  },
  required: ['blockCID', 'executionTime', 'inputOutputCompatibility']
}
export const Package = {
  type: 'object',
  properties: {
    packageCID: {
      type: 'string',
      description: 'CID where the package content (function or manifest) can be fetched from IPFS.'
    },
    packageName: {
      type: 'string',
      description: 'Name of the package.'
    },
    description: {
      type: 'string',
      description: 'Detailed description of the package.'
    },
    version: {
      type: 'string',
      description: 'Version of the package.'
    },
    authorWalletAddress: {
      type: 'string',
      description: 'Ethereum wallet address of the package author.'
    },
    signature: {
      type: 'string',
      description: "Signature verifying the package's authenticity."
    },
    content: {
      type: 'object',
      description: 'The actual content, either function code or manifest of multiaddrs and functions.'
    }
  },
  required: ['packageCID', 'packageName', 'version', 'authorWalletAddress', 'signature', 'content']
}
export const ResourcePool = {
  type: 'object',
  properties: {
    topicID: {
      type: 'string',
      description: 'Unique identifier for the pubsub topic.'
    },
    associatedManifest: {
      type: 'string',
      description: 'CID of the manifest associated with this topic.'
    },
    subscribers: {
      type: 'array',
      description: 'List of subscribers (wallet addresses or node identifiers) participating in this topic.',
      items: {
        type: 'string'
      }
    },
    consensusResults: {
      type: 'array',
      description: 'List of functions ranked by consensus based on input-output efficiency.',
      items: {
        type: 'object',
        properties: {
          functionCID: {
            type: 'string',
            description: 'CID of the function.'
          },
          efficiencyScore: {
            type: 'number',
            description: "A score or metric indicating the function's efficiency or performance based on consensus."
          }
        },
        required: ['functionCID', 'efficiencyScore']
      }
    }
  },
  required: ['topicID', 'associatedManifest', 'subscribers']
}
export const ResourcePoolInvite = {
  type: 'object',
  properties: {
    poolID: {
      type: 'string',
      description: 'Unique identifier for the pool.'
    },
    associatedFunction: {
      type: 'string',
      description: 'CID of the function associated with this pool.'
    },
    peers: {
      type: 'array',
      description: 'List of peers (wallet addresses or node identifiers) participating in this pool.',
      items: {
        type: 'string'
      }
    }
  },
  required: ['poolID', 'associatedFunction', 'peers']
}
export const Review = {
  type: 'object',
  properties: {
    reviewerWalletAddress: {
      type: 'string',
      description: 'Ethereum wallet address of the reviewer.'
    },
    associatedFunctionOrPackage: {
      type: 'string',
      description: 'CID of the function or package being reviewed.'
    },
    rating: {
      type: 'integer',
      description: 'Rating given by the user (e.g., 1-5).'
    },
    comment: {
      type: 'string',
      description: 'Comments or feedback from the reviewer.'
    }
  },
  required: ['reviewerWalletAddress', 'associatedFunctionOrPackage', 'rating']
}
export const Search = {
  type: 'object',
  properties: {
    searchTerm: {
      type: 'string',
      description: 'Term or keyword used for searching.'
    },
    results: {
      type: 'array',
      description: 'List of package CIDs or function CIDs that match the search.',
      items: {
        type: 'string'
      }
    }
  },
  required: ['searchTerm', 'results']
}
export const PackageManifestJSON = {
  type: 'object',
  properties: {
    manifestCID: {
      type: 'string',
      description: 'CID where the manifest can be fetched from IPFS.'
    },
    packages: {
      type: 'array',
      description: 'List of package CIDs included in this manifest.',
      items: {
        type: 'string'
      }
    }
  },
  required: ['manifestCID', 'packages']
}
export const PackagePublicationJSON = {
  type: 'object',
  properties: {
    packageCID: {
      type: 'string',
      description: 'CID where the package content can be fetched from IPFS.'
    },
    packageName: {
      type: 'string',
      description: 'Name of the package.'
    },
    description: {
      type: 'string',
      description: 'Detailed description of the package.'
    },
    version: {
      type: 'string',
      description: 'Version of the package.'
    },
    authorWalletAddress: {
      type: 'string',
      description: 'Ethereum wallet address of the package author.'
    },
    signature: {
      type: 'string',
      description: "Signature verifying the package's authenticity."
    },
    associatedBranch: {
      type: 'string',
      description: 'Name or identifier of the branch associated with this package version.'
    },
    tags: {
      type: 'array',
      description: 'Tags or keywords associated with the package.',
      items: {
        type: 'string'
      }
    }
  },
  required: ['packageCID', 'packageName', 'version', 'authorWalletAddress', 'signature', 'associatedBranch']
}
export const Protocladdress = {
  type: 'object',
  properties: {
    environment: {
      type: 'string',
      description: 'Environment protocol (e.g., /ubuntu/20.40/Kernel...).'
    },
    address: {
      type: 'string',
      description: 'Communication address (e.g., /tcp/127.0....).'
    }
  },
  required: ['environment', 'address']
}
export const PackageSchema = {
  type: 'object',
  properties: {
    packageCID: {
      type: 'string',
      description: 'CID of the package.'
    },
    executionBlocks: {
      type: 'array',
      items: {
        $ref: '#/definitions/Block'
      },
      description: 'List of execution blocks in the package.'
    }
  },
  definitions: {
    Block: {
      $ref: 'path_to_block_schema'
    }
  }
}

// (async () => {
//   const node = new Node({
//     name: 'node1',
//     wallet: Wallet.createRandom()
//   })
//   node.print(node.wallet.address)
//   console.log(node.domain)
//   console.log(node.connect())
// })()
