import EventEmitter from 'node:events';
import Exam from './exam/exam.js';
import { EXAM_FORM_POST_JSON } from './exam/exam.types.js'

export default class ExamProvider  extends EventEmitter{
    exams: Set<any>;
    postedExams: Map<any,any>;
    postExam = async (eid: string,test: string) => {
        // console.log(eid)
        this.postedExams.set(eid,test);
        return eid;
    }
    createExam = async (examDetails: EXAM_FORM_POST_JSON) => {
        let exam = new Exam(examDetails)
        // console.log(exam)
        return exam;
    }
    stopExam = async (eid: string) => {
        this.exams.delete(eid)
        return true;
    }
    getExam = (query: any) => {
        let exams = Array.from(this.exams.values());
        let exam = exams.find((exam) => {
            return exam.sid === query.sid;
        })
        return exam;
    }
    getExams = async () => {
        let exams = Array.from(this.exams.values());
        return exams;
    }
    constructor(){
        super();
        this.exams = new Set<any>();
        this.postedExams = new Map<any,any>();
    }
}
