// import { DELEGATE } from '../marketplace/delegate.ts';
import { DELEGATE } from '../marketplace/delegate.js';
import { TEST } from './test.js';
export type TASK = {
    delegate: DELEGATE;
} & TEST;