const window = {
    innerHeight: 1024,
    innerWidth: 1024
};
export class Tetrahedron {

    vertices = [

        [1, 1, 1],

        [1, -1, -1],

        [-1, 1, -1],

        [-1, -1, 1]

    ];

    antiVertices = [

        [-1, -1, -1],

        [-1, 1, 1],

        [1, -1, 1],

        [1, 1, -1]

    ];

    edges = [

        [0, 1], [0, 2], [0, 3],

        [1, 2], [1, 3], [2, 3]

    ];

    faces = [

        [0, 1, 2],

        [0, 1, 3],

        [0, 2, 3],

        [1, 2, 3]

    ];

    centroid = [...this.faces.flat(), ...this.edges.flat(), ...this.vertices.flat(), ...this.antiVertices.flat()];


    constructor(inverse: boolean = false) {

        if (inverse) {

            this.vertices = [

                [-1, -1, -1],

                [-1, 1, 1],

                [1, -1, 1],

                [1, 1, -1]

            ];

        }
        // this.centroid = [...this.faces.flat(), ...this.edges.flat(), ...this.vertices.flat(), ...this.antiVertices.flat()];

        // Log centroid length and contents for debugging

        console.log('Centroid length:', this.centroid.length);

        console.log('Centroid:', this.centroid);

    }
}