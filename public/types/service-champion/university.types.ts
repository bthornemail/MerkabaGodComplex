import { CONTEXT } from './context';

export type TEST = {
    question: Set<string[]>;
    answer?: string;
    key?: string;
} & CONTEXT;
export type DELEGATE = {
    entendedKey?: string;
};
export type TASK = {
    delegate: DELEGATE;
} & TEST;
export type EXAM = {
    test?: TEST[];
    task?: TASK[];
    proctor?: string;
} & CONTEXT;
export type COURSE = {
    exam?: EXAM[];
} & CONTEXT;