import { CONTEXT } from '../marketplace/context.ts';
import { EXAM } from './exam.js';
export type COURSE = {
    exam?: EXAM[];
} & CONTEXT;


export class Course {
    
}