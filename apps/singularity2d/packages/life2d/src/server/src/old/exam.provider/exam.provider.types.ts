import '../vert.theory.io'
// Common.js and ECMAScript Modules (ESM)
// import * as secp from "@noble/secp256k1";

import { TASK_FORM_DATA_JSON, TASK_QUESTION, TASK_QUESTION_PUBLIC_KEY } from "./exam/exam.task";
import { TEST_ANSWER_PUBLIC_KEY, TEST_FORM_DATA_JSON } from "./exam/exam.test";

// If you're using single file, use global variable instead: `window.nobleSecp256k1`
declare abstract class iProvideExams {
    createTest(testMetaData: TEST_FORM_DATA_JSON): TEST_ANSWER_PUBLIC_KEY;
    createTask(taskFormData: TASK_FORM_DATA_JSON): TASK_QUESTION_PUBLIC_KEY;
}
