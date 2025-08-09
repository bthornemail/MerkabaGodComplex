const DOMAINS = [
    'marketplace2d',
    'coin2d',
    'asset-manager',
    'service-board',
    'exam-proctor',

];

const Domain = {
  name: 'string',
  peerId: 'string',
  address: 'address',
  multiaddrs: 'string',
}
const Person = [
    { name: 'name', type: 'string' },
    { name: 'wallet', type: 'address' }
];

const Delegate = [
    { name: 'name', type: 'string' },
    { name: 'wallet', type: 'address' }
];
const Transfer = [
    { name: 'from', type: 'Person' },
    { name: 'to', type: 'Person' },
    { name: 'value', type: 'uint256' },
    { name: 'service', type: 'address' }
]
const Service = [
    { name: "address", type: "address" },
    { name: "title", type: 'string' },
    { name: "summary", type: 'string' },
    { name: "description", type: 'string' },
    { name: "value", type: 'uint256' }
]
const Asset = [
    { name: "address", type: "address" },
    { name: "title", type: 'string' },
    { name: "summary", type: 'string' },
    { name: "description", type: 'string' },
    { name: "value", type: 'uint256' }
]
const Exam = [
    { name: "address", type: "address" },
    { name: "title", type: 'string' },
    { name: "summary", type: 'string' },
    { name: "description", type: 'string' },
    { name: "test", type: 'xuint256' }
]
export { Person,Transfer,Service,Asset,Exam}



// enum ExamStatus {
//     CREATED,
//     SEALED,
//     COMPLETED
// }

// interface Exam {
//     id: string;
//     tests: TEST[],
//     tasks: TASK[]
// }
// interface TASK {
//     objective: Record<Question, ADDRESS>;
// }
// interface TEST {
//     questions: Question[];
//     answers: Answer[];
// }
// interface Question {
//     id: string;
//     text: string;
//     hash: string;
// }

// interface Answer {
//     questionId: string;
//     text: string;
//     signature: Uint8Array;
// }

// interface Result {
//     examId: string;
// h    isPassed: boolean;
// score: Score;
// }

// class ExamFactory {
//     create(password: string) {
//         const wallet = Wallet.crateRandom();
//         const json = wallet.encrypt(password);
//         const cid = await this.add(json);
//         return {
//             address: wallet.address,
//             key: cid.toString()
//         };
//     }
//     addTask(cid: CID, task: Task, password: string) {

//     }
//     addTest(examCid: CID, test: TEST, password: string) {
//         const json = await this.get(examCid);
//         const wallet = Wallet.decrypt(json, password);
//         const testCid = await this.add(test);
//         const signature = wallet.signMessage(testCid.toString());
//         return [testCid, signature];
//     }
//     register(examCID: CID, exam: EXAM, password: string) {

//     }
// }

// class Exam {
//     answerQuestion(questionId: string, text: string, privateKey: Uint8Array): Answer {
//         const signature = secp256k1.ecdsaSign(createHash(text), privateKey);
//         return { questionId, text, signature };
//     }
//     completeExam(exam: Exam, answers: Answer[]): Exam {
//         return { ...exam, answers, status: ExamStatus.COMPLETED };
//     }
//     verifyAnswers(exam: Exam, delegatePublicKey: Uint8Array): boolean {
//         return exam.answers.every(answer =>
//             verifySignature(answer.signature, createHash(answer.text), delegatePublicKey)
//         );
//     }
//     evaluateExam(exam: Exam): Result {
//         // Evaluate the exam based on the verified answers and return the result
//         const isPassed = // Evaluation Logic here (true or false based on the answers);
// 	    return {
//             examId: exam.id,
//             isPassed,
//             score: // Calculated Score
// 	    };
//     }

// }
