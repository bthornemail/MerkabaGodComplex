export interface Node {
  id: string;
  color?: string;
  x: number;
  y: number;
  z: number;
  vx?: number;
  vy?: number;
  vz?: number;
  group?: string;
  index?: number;
}

interface TetrahedronData {
  nodes: Node[];
  links: { source: string; target: string; color: string }[];
}

function generateSymmetricalTetrahedronVertices(center: Node, size: number): Node[] {
  const height = Math.sqrt(2 / 3) * size;

  const vertices: Node[] = [];
  vertices.push(center);

  // Generate three symmetrical vertices around the center
  for (let i = 0; i < 3; i++) {
    const angle = (2 * Math.PI * i) / 3; // 120-degree intervals
    const x = center.x + size * Math.cos(angle);
    const y = center.y + size * Math.sin(angle);
    const z = center.z;
    vertices.push({ id: `vertex${i}`, x, y, z });
  }

  // Calculate the apex (fourth) vertex
  const apex = {
    id: 'apex',
    x: center.x,
    y: center.y,
    z: center.z + height,
  };
  vertices.push(apex);

  return vertices;
}

function createSymmetricalTetrahedronFromCenter(centerId: string, center: Node, size: number): TetrahedronData {
  const tetrahedronVertices = generateSymmetricalTetrahedronVertices(center, size);

  // Create a new center node
  const centerNode: Node = {
    id: centerId,
    x: center.x,
    y: center.y,
    z: center.z,
    color: 'green',
    group: 'center',
  };

  // Create links between original nodes and the new center node
  const links = tetrahedronVertices.slice(1).map(vertex => ({
    source: vertex.id,
    target: centerNode.id,
    color: 'gray',
  }));

  // Create links between the original nodes to form the tetrahedron edges
  for (let i = 1; i < 4; i++) {
    links.push({ source: tetrahedronVertices[0].id, target: tetrahedronVertices[i].id, color: 'gray' });
  }

  return { nodes: [...tetrahedronVertices, centerNode], links };
}
function createSymmetricalTetrahedronAroundCenter(centerId: string, center: Node, size: number): TetrahedronData {
  const tetrahedronVertices = generateSymmetricalTetrahedronVertices(center, size);

  // Create a new center node
  const centerNode: Node = {
    id: centerId,
    x: center.x,
    y: center.y,
    z: center.z,
    group: 'center',
  };

  const links: any[] = [];

  // Connect each vertex to every other vertex except the one opposite it
  for (let i = 1; i < 4; i++) {
    for (let j = i + 1; j < 4; j++) {
      links.push({ source: tetrahedronVertices[i].id, target: tetrahedronVertices[j].id, color: 'gray' });
    }
    links.push({ source: tetrahedronVertices[i].id, target: centerNode.id, color: 'gray' });
  }

  // Connect the remaining edges
  // links.push({ source: tetrahedronVertices[1].id, target: tetrahedronVertices[2].id, color: 'gray' });
  // links.push({ source: tetrahedronVertices[1].id, target: tetrahedronVertices[3].id, color: 'gray' });
  // links.push({ source: tetrahedronVertices[2].id, target: tetrahedronVertices[3].id, color: 'gray' });

  return { nodes: [...tetrahedronVertices], links };
}
// Function to create multiple symmetrical tetrahedra
function createMultipleTetrahedra(centerPoints: Node[], size: number): TetrahedronData[] {
  const tetrahedra: TetrahedronData[] = [];

  centerPoints.forEach((center, index) => {
      const tetrahedronId = `tetrahedron_${index}`;
      const tetrahedron = createSymmetricalTetrahedronAroundCenter(tetrahedronId, center, size);
      tetrahedra.push(tetrahedron);
  });

  return tetrahedra;
}
function createTetrahedronNode(id: string, [x,y,z]: [number,number,number] = [0,0,0]) {
  // Example usage:
  const centerPoint = { id, x, y, z };
  const tetrahedronFromCenter = createSymmetricalTetrahedronFromCenter('center1', centerPoint, 1);
  // console.log(tetrahedronFromCenter);
  const tetrahedronAroundCenter = createSymmetricalTetrahedronAroundCenter('center1', centerPoint, 1);
  // console.log(tetrahedronAroundCenter);
  return {
    inner: tetrahedronFromCenter,
    outer: tetrahedronAroundCenter,
    center: centerPoint
  }
}
export default function createTetrahedronNodes(nodes:{id: string, x: number,y: number,z: number}[], size: number) {
  const multipleTetrahedra = createMultipleTetrahedra(centerPoints, size);
  // Combine nodes and links of multiple tetrahedra
  const combinedNodes = multipleTetrahedra.flatMap(tetrahedron => tetrahedron.nodes);
  const combinedLinks = multipleTetrahedra.flatMap(tetrahedron => tetrahedron.links);
  
  const superimposedTetrahedra: TetrahedronData = {
    nodes: combinedNodes,
    links: combinedLinks,
  };
  
  console.log(superimposedTetrahedra);
  // console.log(JSON.stringify(superimposedTetrahedra));
  return superimposedTetrahedra;
}

// Example usage:
const centerPoints = [
  { id: 'center1', x: 100, y: 100, z: 100 },
  // { id: 'center2', x: 100, y: 500, z: 400 }, // Add more center points as needed
];

const size = 100;
// console.log(generateSymmetricalTetrahedronVertices({ id: 'centrion', x: 100, y: 100, z: 100 },size))
// createTetrahedronNodes(centerPoints,size)
// console.log("--------------------------")
//   console.log(createSymmetricalTetrahedronAroundCenter("centrion",{
//   id: "centrion",
//   x: 100,
//   y: 100,
//   z: 100
// },100))
function generateSymmetricalTetrahedronVertices2(center: Node, size: number): Node[] {
  const meanSquareDistance = (3 * size * size) / 3; // a^2 + b^2 + c^2 / 3 for equilateral tetrahedron
  const apexHeight = Math.sqrt(3)/2*a//Math.sqrt(meanSquareDistance / 3); // Height from centroid to apex
  const vertices: Node[] = [];
  vertices.push(center);

  // Generate three symmetrical vertices around the center
  for (let i = 0; i < 3; i++) {
    const angle = (2 * Math.PI * i) / 3; // 120-degree intervals
    const x = center.x + size * Math.cos(angle);
    const y = center.y + size * Math.sin(angle);
    const z = center.z;
    vertices.push({ id: `vertex${i}`, x, y, z });
  }

  // Calculate the apex (fourth) vertex
  const apex = {
    id: 'apex',
    x: center.x,
    y: center.y,
    z: center.z + apexHeight,
  };
  vertices.push(apex);

  return vertices;
}
console.log(generateSymmetricalTetrahedronVertices2({ id: 'centrion', x: 10000, y: 10000, z: 10000 },size))
