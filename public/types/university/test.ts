import { CONTEXT } from "../types";

// import { CONTEXT } from '../marketplace/context';
export type TEST = {
    question: Set<string[]>;
    answer?: string;
    key?: string;
} & CONTEXT;

// type MULTIPLE_CHOICE_TEST = Map<TEST_QUESTION, Set<TEST_ANSWER_PUBLIC_KEY>>;
// type QUESTION_ANSWER_TEST = Map<TEST_QUESTION, TEST_ANSWER_PUBLIC_KEY>;
// type BEST_CHOICE_TEST = Map<Set<TEST_QUESTION>, TEST_ANSWER_PUBLIC_KEY>;
// type MATCH_ANSWERS_TEST = Map<Map<TEST_QUESTION, TEST_ANSWER_STRING>, TEST_ANSWER_PUBLIC_KEY>;
