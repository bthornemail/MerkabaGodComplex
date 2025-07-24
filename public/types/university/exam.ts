// import { CONTEXT } from '../marketplace/context.ts';
import { TEST } from './test.js';
import { TASK } from './task.js';
import { CONTEXT } from '../types.js';
export type EXAM = {
    test?: TEST[];
    task?: TASK[];
    proctor?: string;
} & CONTEXT;

export class Exam<Question, AnswerHash> {
    exams: Set<any>;
    posted: Map<any,any>;
    exam: any;
    suite: Map<Question, AnswerHash>;

    createTest = async (question: string, answer: string,signMessage:any) => {
        const answerHash = await signMessage(JSON.stringify(answer))
        this.suite.set(question,answerHash)
        return {
            question,
            answer,
            answerHash
        }
    };
    createTask = async (question: string, answer: string,proctor: string,signMessage:any) => {
        const answerHash = await signMessage(JSON.stringify(answer))
        this.suite.set(question,answerHash)
        return {
            question,
            answer,
            answerHash,
            proctor
        }
    };
    signExam = async (signMessage:any): Promise<any> => {
        let details = await signMessage(JSON.stringify(this.exam));
        let questions = await signMessage(JSON.stringify(Array.from(this.suite)));
        return [details, questions]
    };
    post = async (eid: string,test: string) => {
        // console.log(eid)
        this.posted.set(eid,test);
        return eid;
    }
    create = async (details: EXAM) => {
        let exam = details
        // console.log(exam)
        return exam;
    }
    stop = async (eid: string) => {
        this.exams.delete(eid)
        return true;
    }
    get = (query: any) => {
        let exams = Array.from(this.exams.values());
        let exam = exams.find((exam) => {
            return exam.sid === query.sid;
        })
        return exam;
    }
    constructor(){
        this.exams = new Set<any>();
        this.posted = new Map<any,any>();
    }

}