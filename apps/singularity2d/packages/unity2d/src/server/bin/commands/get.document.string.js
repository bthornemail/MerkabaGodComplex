export default function getDocumentString(content, mimeType = 'application/json') {
    const params = new URLSearchParams();
    Object.entries(content).forEach(([key, value]) => {
        let valueType = typeof value;
        if (Array.isArray(value)) {
            valueType = 'array';
        }
        else if (value === null) {
            valueType = 'null';
        }
        params.append(key, valueType);
    });
    return `data:${mimeType};${params.toString()}`;
}
//# sourceMappingURL=get.document.string.js.map