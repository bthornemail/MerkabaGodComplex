"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Document = void 0;
class BaseDocument {
}
class Document extends BaseDocument {
    constructor(content) {
        super();
        this.getDocumentString = (content, mimeType) => JSON.stringify({ content, mimeType });
        this.content = this.getDocumentString(content);
        Object.entries(content).forEach(([key, value]) => {
            this[key] = value;
        });
    }
}
exports.Document = Document;
//# sourceMappingURL=document.js.map