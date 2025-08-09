// Get the canvas context
const canvas = document.getElementById("life");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Atom class to handle individual SVG-based atoms
class Atom {
    constructor(x, y, radius, imageSrc) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.image = new Image();
        this.image.src = imageSrc;
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x - this.radius, this.y - this.radius, this.radius * 2, this.radius * 2);
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off the edges
        if (this.x - this.radius < 0 || this.x + this.radius > canvas.width) {
            this.vx = -this.vx;
        }
        if (this.y - this.radius < 0 || this.y + this.radius > canvas.height) {
            this.vy = -this.vy;
        }
    }
}

// Generate a random position within the canvas bounds
const getRandomPosition = () => Math.random() * 400 + 50;

// Function to draw a square (atom) on the canvas
const drawAtom = (x, y, color, size) => {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, size, size);
};

// Atom object constructor (modified)
const createAtom = (x, y, color) => {
  return { x, y, vx: 0, vy: 0, color };
};

// Create a group of atoms
const createAtomGroup = (numberOfAtoms, color,imageSrc="public/src/images/code-circle-svgrepo-com.svg") => {
  const group = [];
  for (let i = 0; i < numberOfAtoms; i++) {
    const x = getRandomPosition();
    const y = getRandomPosition();
    const radius = 20; // Adjust as needed for your SVG
    group.push(new Atom(x, y, radius, imageSrc));
  }
  return group;
};

// Define interaction rules between two groups of atoms
const applyRules = (group1, group2, gravity) => {
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
    if (atom1.x <= 0 || atom1.x >= canvas.width) atom1.vx *= -1;
    if (atom1.y <= 0 || atom1.y >= canvas.height) atom1.vy *= -1;
  }
};

// Global array to store all atoms
const atoms = [];

// Create groups of atoms
const whiteAtoms = createAtomGroup(20, "white","public/src/images/code-circle-svgrepo-com.svg");
const blackAtoms = createAtomGroup(20, "black",'public/src/images/code-circle-svgrepo-com.svg');
const greyAtoms = createAtomGroup(20, "grey",'public/src/images/code-circle-svgrepo-com.svg');

// Update the simulation
const updateSimulation = () => {
  applyRules(whiteAtoms, whiteAtoms, 0.32);
  applyRules(whiteAtoms, blackAtoms, -0.17);
  applyRules(blackAtoms, blackAtoms, 0.34);
  applyRules(blackAtoms, whiteAtoms, -0.23);
  applyRules(greyAtoms, greyAtoms, 0.54);
  applyRules(greyAtoms, whiteAtoms, -0.15);
  applyRules(greyAtoms, blackAtoms, -0.16);

  // Clear the canvas and redraw all atoms
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the SVG-based atoms
  for (const atom of [...whiteAtoms, ...blackAtoms, ...greyAtoms]) {
    atom.update();
    atom.draw(ctx);
  }

  // Request the next animation frame
  requestAnimationFrame(updateSimulation);
};

// Start the simulation
updateSimulation();
