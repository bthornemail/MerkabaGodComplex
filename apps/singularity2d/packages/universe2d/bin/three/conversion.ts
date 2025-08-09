import * as THREE from 'three';

/**
 * Convert latitude and longitude to 3D position on a sphere
 * @param radius Radius of the sphere
 * @param lat Latitude in degrees
 * @param lon Longitude in degrees
 * @returns THREE.Vector3 position
 */
export function getPositionOnSphere(
  radius: number, 
  lat: number, 
  lon: number
): THREE.Vector3 {
  // Convert to radians
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  // Calculate 3D coordinates
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return new THREE.Vector3(x, y, z);
}

/**
 * Create a scene with a globe and location markers
 */
export function createEarthWithLocations() {
  // Create the scene, camera, and renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Create sphere geometry for the globe
  const radius = 5;
  const sphereGeometry = new THREE.SphereGeometry(radius, 32, 32);
  const sphereMaterial = new THREE.MeshBasicMaterial({ 
    color: 0x0000ff, 
    wireframe: true 
  });
  const globe = new THREE.Mesh(sphereGeometry, sphereMaterial);
  scene.add(globe);

  // Define locations
  const locations = [
    { name: 'New York', lat: 40.7128, lon: -74.0060 },
    { name: 'Tokyo', lat: 35.6762, lon: 139.6503 },
    { name: 'Sydney', lat: -33.8688, lon: 151.2093 }
  ];

  // Add location markers
  locations.forEach(location => {
    // Create a small sphere as a marker
    const markerGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const markerMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const marker = new THREE.Mesh(markerGeometry, markerMaterial);

    // Position the marker on the globe
    const position = getPositionOnSphere(radius, location.lat, location.lon);
    marker.position.copy(position);

    // Add marker to the scene
    scene.add(marker);
  });

  // Position camera
  camera.position.z = 10;

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    
    // Optional: Rotate the globe
    globe.rotation.y += 0.005;

    renderer.render(scene, camera);
  }
  animate();
}

// Usage
// export createEarthWithLocations();

// Utility function for adding location markers dynamically
export function addLocationMarker(
  scene: THREE.Scene, 
  radius: number, 
  lat: number, 
  lon: number, 
  color: number = 0xff0000,
  size: number = 0.1
) {
  const markerGeometry = new THREE.SphereGeometry(size, 16, 16);
  const markerMaterial = new THREE.MeshBasicMaterial({ color });
  const marker = new THREE.Mesh(markerGeometry, markerMaterial);

  const position = getPositionOnSphere(radius, lat, lon);
  marker.position.copy(position);

  scene.add(marker);
  return marker;
}