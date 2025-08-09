export default function getDocumentString(content: Record<string, any>, mimeType: string = 'application/json'): string {
    const params = new URLSearchParams();

    Object.entries(content).forEach(([key, value]: [string, any]) => {
        let valueType: "string"
            | "number"
            | "bigint"
            | "boolean"
            | "symbol"
            | "undefined"
            | "object"
            | "function"
            | "array"
            | "null"
            = typeof value;

        if (Array.isArray(value)) {
            valueType = 'array';
        } else if (value === null) {
            valueType = 'null';
        }

        params.append(key, valueType);
    });

    return `data:${mimeType};${params.toString()}`;
}
