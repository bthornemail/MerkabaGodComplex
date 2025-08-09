import { PROPERTIES } from "./definitions";

export abstract class BaseLexicon {
    abstract properties: PROPERTIES;
}
export default class Lexicon extends BaseLexicon {
    properties: PROPERTIES = {};
}