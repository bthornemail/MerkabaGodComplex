// Get the canvas context
const canvas = document.getElementById("life") as HTMLCanvasElement;
const context = canvas.getContext("2d") as CanvasRenderingContext2D;
const contextWidth =  document.body.clientWidth; //500;
const contextHeight = document.body.clientHeight; //500;
const contextScale = 1000;

// Function to draw a square (atom) on the canvas
const drawAtom = (x: number, y: number, color: string | CanvasGradient | CanvasPattern, size: number) => {
  context.fillStyle = color;
  context.fillRect(x, y, size, size);
};

// Atom object constructor
const createAtom = (x: number, y: number, color: any) => {
  return { x, y, vx: 0, vy: 0, color };
};

// Generate a random position within the canvas bounds
const getRandomPosition = () => Math.random() * 400 + 50;

// Create a group of atoms
const createAtomGroup = (numberOfAtoms: number, color: string) => {
  const group = [];
  for (let i = 0; i < numberOfAtoms; i++) {
    const atom = createAtom(getRandomPosition(), getRandomPosition(), color);
    group.push(atom);
    atoms.push(atom);
  }
  return group;
};

// Define interaction rules between two groups of atoms
const applyRules = (group1: { x: any; y: any; vx: number; vy: number; color: any; }[], group2: { x: any; y: any; vx: number; vy: number; color: any; }[], gravity: number) => {
  for (const atom1 of group1) {
    let forceX = 0;
    let forceY = 0;

    for (const atom2 of group2) {
      const dx = atom1.x - atom2.x;
      const dy = atom1.y - atom2.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 0 && distance < 80) {
        const force = (gravity * 1) / distance;
        forceX += force * dx;
        forceY += force * dy;
      }
    }

    // Update velocity and position
    atom1.vx = (atom1.vx + forceX) * 0.5;
    atom1.vy = (atom1.vy + forceY) * 0.5;
    atom1.x += atom1.vx;
    atom1.y += atom1.vy;

    // Bounce off canvas edges
    if (atom1.x <= 0 || atom1.x >= contextScale) atom1.vx *= -1;
    if (atom1.y <= 0 || atom1.y >= contextScale) atom1.vy *= -1;
  }
};

// Global array to store all atoms
const atoms: { x: any; y: any; vx: number; vy: number; color: any; }[] = [];

// Create groups of atoms
const whiteAtoms = createAtomGroup(200, "white");
const blackAtoms = createAtomGroup(200, "black");
const greyAtoms = createAtomGroup(200, "grey");
// const yellowAtoms = createAtomGroup(200, "yellow");
// const redAtoms = createAtomGroup(200, "red");
// const greenAtoms = createAtomGroup(200, "green");

// Update the simulation
const updateSimulation = () => {
  applyRules(whiteAtoms, whiteAtoms, 0.32);
  applyRules(whiteAtoms, blackAtoms, -0.17);
  applyRules(blackAtoms, blackAtoms, 0.34);
  applyRules(blackAtoms, whiteAtoms, -0.23);
  applyRules(greyAtoms, greyAtoms, 0.54);
  applyRules(greyAtoms, whiteAtoms, -0.15);
  applyRules(greyAtoms, blackAtoms, -0.16);
  // // Apply interaction rules
  // applyRules(greenAtoms, greenAtoms, -0.32);
  // applyRules(greenAtoms, redAtoms, -0.17);
  // applyRules(greenAtoms, yellowAtoms, 0.34);
  // applyRules(redAtoms, redAtoms, -0.1);
  // applyRules(redAtoms, greenAtoms, -0.34);
  // applyRules(yellowAtoms, yellowAtoms, 0.15);
  // applyRules(yellowAtoms, greenAtoms, -0.2);

  // Clear the canvas and redraw all atoms
  context.clearRect(0, 0, contextWidth, contextHeight);
  drawAtom(0, 0, "rgba(0,0,0,0)", contextScale); // Draw background
  for (const atom of atoms) {
    drawAtom(atom.x, atom.y, atom.color, 5);
  }

  // Request the next animation frame
  // setTimeout(()=>{
    requestAnimationFrame(updateSimulation);
  // },10)
};

// Start the simulation
updateSimulation();