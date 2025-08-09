import '../../vert.theory.io.js'
import { Wallet } from "ethers";
import { TASK_CONSUMER } from "./exam.task.js";
import { BEST_CHOICE_TEST, MATCH_ANSWERS_TEST, MULTIPLE_CHOICE_TEST, QUESTION_ANSWER_TEST, TEST_CONSUMER } from "./exam.test.js";

type TEST_VIEWER = ANONYMOUS_WEB_CLIENT;
type TASK_VIEWER = ANONYMOUS_WEB_CLIENT;

type EXAM_PROVIDER = Wallet;
type EXAM_CONSUMER = TEST_CONSUMER | TASK_CONSUMER | TEST_VIEWER | TASK_VIEWER;
type EXAM_VIEWER = Wallet;

type EXAM_PRIVATE_KEY = PRIVATE_KEY;
type EXAM_PUBLIC_KEY = PUBLIC_KEY;
type EXAM_SIGNATURE = SIGNATURE;
type EXAM_PROVIDER_PRIVATE_KEY = PRIVATE_KEY;
type EXAM_PROVIDER_PUBLIC_KEY = PUBLIC_KEY;

type EXAM_TEST = QUESTION_ANSWER_TEST | MULTIPLE_CHOICE_TEST | BEST_CHOICE_TEST | MATCH_ANSWERS_TEST;
type EXAM_FEE = number;
type EXAM_PROCTOR = {};
type EXAM_TITLE = string;
type EXAM_SUMMARY = string;
type EXAM_DESCRIPTION = string;
export type EXAM_FORM_POST_JSON = {
    title: EXAM_TITLE;
    summary: EXAM_SUMMARY;
    description: EXAM_DESCRIPTION;
    images?: BASE_64_MIME_IMAGE[];
    tags?: ID_TAG[];
    keywords?: KEYWORD_STRING[];
    tests?: Set<EXAM_TEST>;
};
type EXAM_POST_OPTIONS = {
    proctor?: EXAM_PROCTOR;
    fee?: EXAM_FEE;
};
/*



type TASK_META_DATA_JSON = {};
type TASK_ANSWER_METADATA_JSON = { question: QUESTION_KEY,proctorSignature: PROCTOR_EXAM_SIGNATURE}[]
type TASK_PUBLIC_KEY = Uint8Array;
type TASK_ANSWER_HASH = Uint8Array;
type TASK_RESULTS_JSON = {question: QUESTION_STRING,proctor:PROCTOR_PUBLIC_KEY,score: BigInt}

// SMART_CONTRACT --> EXAM_PROVIDER = Uint8Array;

type EXAM_CREATOR_KEY = Uint8Array;
type EXAM_PUBLIC_KEY = Uint8Array;
type EXAM_QUERY_JSON = {
    address?: EXAM_PUBLIC_KEY;
    examee?:  TEST_CONSUMER | TASK_CONSUMER;
    proctor?: PROCTOR_PUBLIC_KEY;
}
type EXAM_QUERY_RESULTS_JSON = {
    creator: EXAM_CREATOR_KEY,
    publicKey: EXAM_PUBLIC_KEY,
    proctor?: PROCTOR_PUBLIC_KEY,
    metadata: TEST_META_DATA_JSON | TASK_META_DATA_JSON
}
type EXAM_PARAMATERS = TEST_NFT | TASK_NFT;
type NFT_ADDRESS = Uint8Array;

type TASK_NFT = {
    owner: TEST_PROVIDER,
    address: NFT_ADDRESS,
    uri: CIDv1
}
type TEST_NFT = {
    owner: TEST_PROVIDER,
    address: NFT_ADDRESS,
    uri: CIDv1
}
interface iPostTest {
    createTest: (new_test_json: TEST_META_DATA_JSON) => TEST_NFT;
    postTest: (test_json: TEST_META_DATA_JSON) => TEST_NFT;
}
interface iPostTask {
    postTask: (task_json:TASK_META_DATA_JSON,proctor:PROCTOR_PUBLIC_KEY) => TASK_NFT;
}
interface iGetTest {
    getTest: (signer:TEST_CONSUMER,testFee?: LIFE2D_TOKEN) => TEST_PUBLIC_KEY | null;
    signTest: (testPublicKey:TEST_PUBLIC_KEY,answers: TEST_ANSWERS_METADATA_JSON) => TEST_ANSWER_HASH;
    postResults: (answerHash: TEST_ANSWER_HASH,testFee?:LIFE2D_TOKEN) => TEST_NFT | null;
}
interface iGetTask {
    getTask: (signer:TASK_CONSUMER,taskFee?: LIFE2D_TOKEN) => TASK_PUBLIC_KEY | null;
    signTask: (taskPublicKey:TEST_PUBLIC_KEY,proctorSignature: PROCTOR_EXAM_SIGNATURE) => TASK_ANSWER_HASH;
    postResults: (answerHash: TASK_ANSWER_HASH,testFee?:LIFE2D_TOKEN) => TASK_NFT | null;
}
interface iProctorExam {
    signExam: (task:TASK_PUBLIC_KEY,proctorPrivateKey: PROCTOR_EXAM_PRIVATE_KEY,score:BigInt) => PROCTOR_EXAM_SIGNATURE;
}
interface iVerifyTestResults {
    verifyTest: (address: TEST_CONSUMER,test:TEST_NFT) => TEST_RESULTS_JSON;
}
interface iVerifyTaskResults {
    verifiyTask: (address: TASK_CONSUMER,task:TASK_NFT) => TASK_RESULTS_JSON;
}
interface iFindExams {
    filterAndFindExams: (query: EXAM_QUERY_JSON) => EXAM_QUERY_RESULTS_JSON;
}

interface iSIGN_TEST_QUESTIONS {
    encryptTestQuestion(question: TEST_QUESTION,answer: TEST_ANSWER): TEST_ANSWER_PUBLIC_KEY;
}
*/
