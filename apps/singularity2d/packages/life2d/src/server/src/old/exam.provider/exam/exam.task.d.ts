import { Wallet } from "ethers.js";
import { ANSWER_STRING, QUESTION_KEY, QUESTION_STRING } from "./exam.test.js";

type TASK_WALLET = Wallet;
type TASK_PROVIDER = Wallet;
type TASK_CONSUMER = Wallet;
type TASK_VIEWER = ANONYMOUS_WEB_CLIENT;

type TASK_QUESTION = QUESTION_STRING;
type TASK_QUESTION_PUBLIC_KEY = PUBLIC_KEY;
type TASK_ANSWER = ANSWER_STRING;
type TASK_ANSWER_SIGNATURE = Uint8Array;

type TASK_PRIVATE_KEY = PRIVATE_KEY;
type TASK_PUBLIC_KEY = PUBLIC_KEY;

type TASK_ANSWER_PUBLIC_KEY = PUBLIC_KEY;
type TASK_ANSWER_PRIVATE_KEY = PRIVATE_KEY;


type TASK_ANSWERS_METADATA_JSON = { question: QUESTION_KEY, answer: ANSWER_STRING }[]
type TASK_RESULTS_JSON = { question: QUESTION_STRING, score: BigInt }

type TASK_FORM_DATA_JSON = {
    title: string;
    summary: string;
    description: string;
    images: string[];
    type: string;
    // questions: {question: QUESTION_STRING,answerHash: TASK_ANSWER_HASH};
};

