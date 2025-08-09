
export const tetrahedronVertices: number[][] = [
    [1, 1, 1],
    [1, -1, -1],
    [-1, 1, -1],
    [-1, -1, 1]
];
export const tetrahedronIndicies: number[] = [ //This is used to build the faces of the regula tetrahedron
    0, 1, 2,  // Face 1
    0, 1, 3,  // Face 2
    0, 2, 3,  // Face 3
    1, 2, 3   // Face 4
]
export const tetrahedronInverted: number[][] = [
    [-1, -1, -1],
    [-1, 1, 1],
    [1, -1, 1],
    [1, 1, -1]
]
// ------------------------------------------

export const TetrahedronSchema = new Map([
    ["environment", "actor"],
    ["environment", "action"],
    ["environment", "time"],
    ["actor", "action"],
    ["actor", "time"],
    ["action", "time"]
]);
export const Marketplace2dEnvironment: [string, string][][] = [
    [
        ["identity", "Marketplace2d"],
        ["identity/name", "Marketplsce 2D"],
        ["identity/http", "life2d.com"],
        ["identity/port", "5173"]
    ],
    [
        ["Marketplace2D/Listings", "all"],
        ["Marketplace2D/Listings", "400"],
        ["Marketplace2D/Listings/0xTay", "0xBrian"],
        ["Chat/0xTay", "0xBrian/Hey What's up?"]
    ]
];
export const Marketplace2dActor: [string, string][] = [
    ["identity", "0xBrian"],
    ["name", "Brian"],
    ["age", "38"],
    ["Marketplace2D/Listing/QmFoodDeliveryService", ""],
    ["identity", "0xBrian"]
];
export const Marketplace2dAction: [string, string][] = [
    ["0xBrian", "0xBrian"],
    ["0xBrian", "0xBrian"],
    ["0xBrian", "0xBrian"],
    ["0xBrian", "0xBrian"],
    ["0xBrian", "0xBrian"]
]
export const Marketplace2dTime: [string, number][] = [
    ["0xBrian", 0],
    ["0xBrian", 1],
    ["0xBrian", 2],
    ["0xBrian", 3],
    ["0xBrian", 4]
]

export const environment: [string, string][][] = [
    [
        ["identity", "identity"],
        ["address", "0xBrian"],
        ["name", "Brian"],
        ["age", "38"]
    ],
    [
        ["identity", "get"],
        ["function", "return identity"]
    ],
    [
        ["identity", "Marketplace2D"],
        ["listings", ":listings"]
    ],
    [
        ["identity", "Chat"],
        ["0xTay", "0xBrian"],
        ["0xTay", "Hey What's up?"]
    ]
];
export const actor: [string, string][] = [
    ["identity", "0xBrian"],
    ["name", "Brian"],
    ["age", "38"],
    ["Marketplace2D/Listing/QmFoodDeliveryService", ""],
    ["identity", "0xBrian"]
];
export const action: [string, string][] = [
    ["0xBrian", "0xBrian"],
    ["0xBrian", "0xBrian"],
    ["0xBrian", "0xBrian"],
    ["0xBrian", "0xBrian"],
    ["0xBrian", "0xBrian"]
]
export const time: [string, number][] = [
    ["0xBrian", 0],
    ["0xBrian", 1],
    ["0xBrian", 2],
    ["0xBrian", 3],
    ["0xBrian", 4]
]