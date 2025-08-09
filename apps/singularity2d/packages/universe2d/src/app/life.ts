// Get the canvas context
const canvas = document.getElementById("life");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Atom class to handle individual SVG-based atoms and apply forces
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
        // Draw the SVG image based on the atom's x, y, and radius
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

    applyForce(forceX, forceY) {
        this.vx += forceX;
        this.vy += forceY;
    }
}

// Initialize atoms
const atoms = [];
const numAtoms = 100;
const svgSrc = "public/src/images/code-circle-svgrepo-com.svg"; // Path to the SVG image

for (let i = 0; i < numAtoms; i++) {
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height;
    let radius = 20;
    atoms.push(new Atom(x, y, radius, svgSrc));
}

// Apply gravitational force between atoms
function applyForces() {
    const gravity = 0.05; // Gravitational force constant

    for (let i = 0; i < atoms.length; i++) {
        for (let j = i + 1; j < atoms.length; j++) {
            const atom1 = atoms[i];
            const atom2 = atoms[j];

            const dx = atom2.x - atom1.x;
            const dy = atom2.y - atom1.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const force = gravity / (distance * distance); // Inverse square law for force

            const forceX = force * dx / distance;
            const forceY = force * dy / distance;

            // Apply forces in opposite directions to both atoms
            atom1.applyForce(-forceX, -forceY);
            atom2.applyForce(forceX, forceY);
        }
    }
}

// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply forces to the atoms
    applyForces();

    // Update and draw atoms
    for (let atom of atoms) {
        atom.update();
        atom.draw(ctx);
    }

    requestAnimationFrame(animate);
}

// Start the animation
animate();
