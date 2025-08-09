import * as secp from '@noble/secp256k1';
import Delegate from "../../user.manager/user/delegate.js";
import { USER_AUTH } from '../../user.manager/user.manager.types.js';

type Question = string;
type AnswerHash = string;
export default class Exam extends Delegate {
    exam: any;
    suite: Map<Question, AnswerHash>;

    createTest = async (question: string, answer: string) => {
        const answerHash = await this.signMessage(JSON.stringify(answer))
        this.suite.set(question,answerHash)
        return {
            question,
            answer,
            answerHash
        }
    };
    createTask = async (question: string, answer: string,proctor: string) => {
        const answerHash = await this.signMessage(JSON.stringify(answer))
        this.suite.set(question,answerHash)
        return {
            question,
            answer,
            answerHash,
            proctor
        }
    };
    signExam = async (): Promise<any> => {
        let details = await this.signMessage(JSON.stringify(this.exam));
        let questions = await this.signMessage(JSON.stringify(Array.from(this.suite)));
        return [details, questions]
    };
    constructor(examJSON: any, userAuth?: USER_AUTH<string>) {
        super(userAuth);
        this.suite = new Map<Question, AnswerHash>();
        this.exam = examJSON;
    }
}
