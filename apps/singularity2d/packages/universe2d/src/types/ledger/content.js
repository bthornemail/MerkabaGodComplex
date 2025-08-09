"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Content = void 0;
const get_content_string_1 = __importDefault(require("../bin/commands/get.content.string"));
class BaseContent {
}
class Content extends BaseContent {
    constructor(content) {
        super();
        this.getContentString = get_content_string_1.default;
        this.content = this.getContentString(content);
        Object.entries(content).forEach(([key, value]) => {
            this[key] = value;
        });
    }
}
exports.Content = Content;
//# sourceMappingURL=content.js.map