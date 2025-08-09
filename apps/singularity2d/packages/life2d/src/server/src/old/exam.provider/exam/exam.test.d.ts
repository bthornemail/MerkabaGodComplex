import { Wallet } from "ethers";

type TEST_WALLET = Wallet;
type TEST_PROVIDER = Wallet;
type TEST_CONSUMER = Wallet;
type TEST_VIEWER = ANONYMOUS_WEB_CLIENT;

type QUESTION_STRING = string;
type QUESTION_KEY = Uint8Array;
type ANSWER_STRING = string;

type MULTIPLE_CHOICE_TEST = Map<TEST_QUESTION, Set<TEST_ANSWER_PUBLIC_KEY>>;
type QUESTION_ANSWER_TEST = Map<TEST_QUESTION, TEST_ANSWER_PUBLIC_KEY>;
type BEST_CHOICE_TEST = Map<Set<TEST_QUESTION>, TEST_ANSWER_PUBLIC_KEY>;
type MATCH_ANSWERS_TEST = Map<Map<TEST_QUESTION, TEST_ANSWER_STRING>, TEST_ANSWER_PUBLIC_KEY>;

type TEST_QUESTION = QUESTION_STRING;
type TEST_ANSWER = ANSWER_STRING;
type TEST_ANSWER_HASH = Uint8Array;

type TEST_PRIVATE_KEY = PRIVATE_KEY;
type TEST_PUBLIC_KEY = PUBLIC_KEY;

type TEST_ANSWER_PUBLIC_KEY = PUBLIC_KEY;
type TEST_ANSWER_PRIVATE_KEY = PRIVATE_KEY;


type TEST_ANSWERS_METADATA_JSON = { question: QUESTION_KEY, answer: ANSWER_STRING }[]
type TEST_RESULTS_JSON = { question: QUESTION_STRING, score: BigInt }

type TEST_FORM_DATA_JSON = {
    title: string;
    summary: string;
    description: string;
    images: string[];
    type: string;
    // questions: {question: QUESTION_STRING,answerHash: TEST_ANSWER_HASH};
};


// Common.js and ECMAScript Modules (ESM)
// import * as secp from "@noble/secp256k1";

// If you're using single file, use global variable instead: `window.nobleSecp256k1`
declare abstract class _EXAM_TEST {
    // private privateKey: Uint8Array;
    // private publicKey: EXAM_PUBLIC_KEY;
    public minimumSignerAmount: number;
    // private createPrivateKey(): Promise<Uint8Array>;
    // private createPublicKey(privateKey: Uint8Array): Promise<Uint8Array>;
    // private createSignerKey(privateKey: Uint8Array, signerPublicKey: Uint8Array): Promise<Uint8Array>;
    // private createMultiSigKey(message, [...signers], mininumSigners): Promise<Uint8Array>;
    // public createAgreement(arbitrator: Uint8Array, signers: Uint8Array[],): Promise<Uint8Array>;
    // public signAgreement(arbitrator: Uint8Array,): Boolean;
    // public verifyAgreement(arbitrator: Uint8Array,): Boolean;
    // public constructor(test: TEST_NFT);
    // public constructor(task: TASK_NFT, proctor: PROCTOR_PUBLIC_KEY);
}
