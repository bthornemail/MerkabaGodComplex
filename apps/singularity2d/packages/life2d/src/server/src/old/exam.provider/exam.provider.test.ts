import VertTheory from "../vert.theory.js";
import { EXAM_FORM_POST_JSON } from "./exam/exam.types.js";
import Exam from "./exam/exam.js";
let vert: VertTheory = new VertTheory();

describe('Exam Provider', () => {
    let newExam: Exam;
    let postedExam: EXAM_FORM_POST_JSON;
    it("loads up exam provider", async () => {
        let exams = await vert.examProvider.getExams();
        // console.log(exams)
        expect(exams).toBeTruthy;
    });
    describe("It Creates an exam", () => {
        let newExam: Exam;
        beforeAll(async () => {
            newExam = await vert.examProvider.createExam({
                title: "TITLE_STRING",
                summary: "SUMMARY_STRING",
                description: "string"
            });
        });
        it("creates test", async () => {
            // console.log("test")
            let test = await newExam.createTest("What's your name", 'Brian');
            // console.log(test)
            expect(test).toBeTruthy();
        });
        it("verify exam to provider", async () => {
            let [details, questions] = await newExam.signExam();
            let exams = await vert.examProvider.postExam(details, questions)
            // console.log(exams)
            expect(exams).toBeTruthy();
        });
        it("post exam to provider", async () => {
            let exams = await vert.examProvider.getExams();
            // console.log(exams)
            expect(exams).toHaveLength(0);
        });
    })
})