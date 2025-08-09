(async () => {
    interface Point {
        id: number;
        vector: Float32Array; // Use typed array to represent the vector
    }

    class NearestNeighborSearch {
        private points: Point[];

        constructor(points: Point[]) {
            this.points = points;
        }

        findKNearestNeighbors(target: Float32Array, k: number): { id: number; point: Point }[] {
            if (this.points.length === 0 || k <= 0) {
                return [];
            }

            const distances: { id: number; point: Point; distance: number }[] = [];

            // Calculate distances and store them with points and ids
            for (const point of this.points) {
                const distance = this.distanceSquared(target, point.vector);
                distances.push({ id: point.id, point, distance });
            }

            // Sort distances in ascending order
            distances.sort((a, b) => a.distance - b.distance);

            // Take the first k points as nearest neighbors
            return distances.slice(0, k).map(item => ({ id: item.id, point: item.point }));
        }

        private distanceSquared(point1: Float32Array, point2: Float32Array): number {
            let sum = 0;
            for (let i = 0; i < point1.length; i++) {
                const diff = point1[i] - point2[i];
                sum += diff * diff;
            }
            return sum;
        }
    }

    // Example usage:
    console.time("Point");
    const points: Point[] = new Array(1000000).fill(0).map((_, index) => ({
        id: index,
        vector: new Float32Array([Math.random() * 1000, Math.random() * 1000, Math.random() * 1000])
    }));
    console.timeEnd("Point");

    console.time("targetPoint");
    const search = new NearestNeighborSearch(points);
    const targetPointId = 3; // Assume you want to find nearest neighbors for the point with ID 3
    const targetPoint = points.find(point => point.id === targetPointId);
    const targetVector = targetPoint!.vector; // Assuming targetPoint is not null
    const k = 3; // Find the 2 nearest neighbors
    console.timeEnd("targetPoint");

    console.time("search");
    const nearestNeighbors = search.findKNearestNeighbors(targetVector, k);
    console.log("K Nearest neighbors:", nearestNeighbors);
    console.timeEnd("search");
})();
(async () => {
    interface Point {
        id: number;
        vector: Float32Array; // Use typed array to represent the vector
    }

    class NearestNeighborSearch {
        private points: Point[];

        constructor(points: Point[]) {
            this.points = points;
        }

        findKNearestNeighbors(target: Float32Array, k: number): { id: number; point: Point }[] {
            if (this.points.length === 0 || k <= 0) {
                return [];
            }

            const distances: { id: number; point: Point; distance: number }[] = [];

            // Calculate distances and store them with points and ids
            for (const point of this.points) {
                const distance = this.distanceSquared(target, point.vector);
                distances.push({ id: point.id, point, distance });
            }

            // Sort distances in ascending order
            distances.sort((a, b) => a.distance - b.distance);

            // Take the first k points as nearest neighbors
            return distances.slice(0, k).map(item => ({ id: item.id, point: item.point }));
        }

        private distanceSquared(point1: Float32Array, point2: Float32Array): number {
            let sum = 0;
            for (let i = 0; i < point1.length; i++) {
                const diff = point1[i] - point2[i];
                sum += diff * diff;
            }
            return sum;
        }
    }

    // Example usage:
    console.time("Point");
    const points: Point[] = new Array(1000000).fill(0).map((_, index) => ({
        id: index,
        vector: new Float32Array([Math.random() * 1000, Math.random() * 1000, Math.random() * 1000])
    }));
    console.timeEnd("Point");

    console.time("targetPoint");
    const search = new NearestNeighborSearch(points);
    const targetPointId = 3; // Assume you want to find nearest neighbors for the point with ID 3
    const targetPoint = points.find(point => point.id === targetPointId);
    const targetVector = targetPoint!.vector; // Assuming targetPoint is not null
    const k = 3; // Find the 2 nearest neighbors
    console.timeEnd("targetPoint");

    console.time("search");
    const nearestNeighbors = search.findKNearestNeighbors(targetVector, k);
    console.log("K Nearest neighbors:", nearestNeighbors);
    console.timeEnd("search");
})();
