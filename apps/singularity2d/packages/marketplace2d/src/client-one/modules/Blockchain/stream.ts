import { Readable } from 'stream';

(async () => {
    interface Point {
        id: number;
        x: number;
        y: number;
        z: number;
    }

    class NearestNeighborSearch {
        private pointMap: Map<number, Point>; // Use a Map to store points by their IDs

        constructor(points: Point[]) {
            this.pointMap = new Map();
            points.forEach(point => this.pointMap.set(point.id, point));
        }

        async *findKNearestNeighborsStream(targetVector: Float32Array, k: number): AsyncGenerator<{ id: number; point: Point }> {
            const targetPointId = -1; // Dummy target point ID since we're comparing vectors
            const targetPoint: Point = { id: targetPointId, x: targetVector[0], y: targetVector[1], z: targetVector[2] };

            const distances: { id: number; point: Point; distance: number }[] = [];

            // Calculate distances and store them with points and ids
            for (const [id, point] of this.pointMap.entries()) {
                const distance = this.distanceSquared(targetPoint, point);
                distances.push({ id, point, distance });
            }

            // Sort distances in descending order
            distances.sort((a, b) => b.distance - a.distance);

            // Take the first k points as nearest neighbors
            for (let i = 0; i < k; i++) {
                yield { id: distances[i].id, point: distances[i].point };
            }
        }

        private distanceSquared(point1: Point, point2: Point): number {
            const dx = point1.x - point2.x;
            const dy = point1.y - point2.y;
            const dz = point1.z - point2.z;
            return dx * dx + dy * dy + dz * dz;
        }
    }

    // Example usage:
    console.time("Point");
    const points: Point[] = new Array(1000000).fill(0).map((_, index) => ({
        id: index,
        x: Number((Math.random() * 1000).toFixed()),
        y: Number((Math.random() * 1000).toFixed()),
        z: Number((Math.random() * 1000).toFixed())
    }));
    console.timeEnd("Point");

    const search = new NearestNeighborSearch(points);
    const targetVector = new Float32Array([Math.random() * 1000, Math.random() * 1000, Math.random() * 1000]);
    const k = 300000; // Find the 3 nearest neighbors

    // Create a readable stream that pushes the search results as a buffer
    const readableStream = Readable.from(search.findKNearestNeighborsStream(targetVector, k));

    // Consume the stream
    for await (const data of readableStream) {
        console.log("Nearest neighbor:", data);
    }
})();
