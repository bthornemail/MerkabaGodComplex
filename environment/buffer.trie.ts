

export interface HarmonicVector {
    id: string;
    length: number;
    sin: number;
    cos: number;
    tan: number;
    h: number;
    buffer: ArrayBuffer;
    geometry: number[];
    shapes: boolean[];
    phase: number;
}
export function harmonize(
    input: string | ArrayBufferView,
    originBuffer?: ArrayBufferView
): HarmonicVector {
    let view: Uint8Array;
    if (typeof input === "string") {
        view = new TextEncoder().encode(input.toUpperCase());
    } else {
        view = new Uint8Array(input.buffer);
    }

    const rawValues = Array.from(view);
    const values = originBuffer
        ? rawValues.map(
            (v, i) => v ^ new Uint8Array(originBuffer.buffer)[i % originBuffer.byteLength]
        )
        : rawValues;

    const h = Math.hypot(...values);
    return {
        id: typeof input === "string" ? input : `BUFFER_${view.length}`,
        length: values.length,
        sin: Math.sin(h / Math.PI),
        cos: Math.cos(h / 1.61803398875), // GOLDEN_RATIO
        tan: Math.tan(Math.PI / (h || 1e-10)),
        h,
        buffer: view.buffer,
        geometry: new Array(20).fill(false).map((_, index) => { return (view.length % (index + 1))}),
        shapes: new Array(20).fill(false).map((_, index) => { return (view.length % (index + 1)) === 0 ? true : false; }),
        phase: view.length % 7
    };
}
function classifyGeometry(geometry: boolean[]): string {
    const geometryTypes = [
        "Point",
        "Line",
        "Triangle",
        "Quadrilateral",
        "Pentagon",
        "Hexagon",
        "Heptagon",
        "Octagon",
        "Nonagon",
        "Decagon"
    ];
    const classified = geometry.map((isTrue, index) => {
        return isTrue ? geometryTypes[index] : "None";
    }).filter(type => type !== "None");
    return classified.join(", ");
}
console.log(classifyGeometry(harmonize("Hello World this is soco").shapes))
console.log(harmonize("Hello World this is soco").geometry)


// Convert buffer to unit ray
export function typedArrayToRay(input: Uint8Array): number[] {
    const norm = Math.hypot(...input);
    return norm === 0 ? Array.from(input) : Array.from(input).map((v) => v / norm);
}