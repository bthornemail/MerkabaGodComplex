import { readFileSync } from 'node:fs'
const data = readFileSync('./marketplace.json', 'utf8')
// Use the data
//console.log(data);
interface NodeType {
    id: string;
    name: string;
    val: number;
}

interface LinkType {
    source: string;
    target: string;
}

const schema = {
    "domain": {
        "name": "Marketplace 2D",
        "version": "1"
    },
    "types": {
        "CIDv1": [
            {
                "name": "link",
                "type": "string"
            }
        ],
        // other type definitions...
    }
};

function generateNodesAndLinks(schema: any): { nodes: NodeType[], links: LinkType[] } {
    const nodes: NodeType[] = [];
    const links: LinkType[] = [];

    for (const typeName in schema.types) {
        const typeProperties = schema.types[typeName];

        // Assume first property is the ID, second is the name, third is the val
        if (typeProperties.length >= 3) {
            const id = typeName;
            const name = typeProperties[1].name;
            const val = 1; // Or any default value
            nodes.push({ id, name, val });
        }

        for (const property of typeProperties) {
            if (property.type === "string" && property.name === "link") {
                // Assume it's a link
                const source = typeName;
                const target = property.type;
                links.push({ source, target });
            }
        }
    }

    return { nodes, links };
}

const { nodes, links } = generateNodesAndLinks(JSON.parse(data));
console.log(nodes);
console.log(links);
