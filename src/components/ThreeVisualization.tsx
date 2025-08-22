import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ComputationalSystemData } from '../types';

interface ThreeVisualizationProps {
  systems: ComputationalSystemData[];
  selectedSystem: ComputationalSystemData | null;
  selectionQueue: ComputationalSystemData[];
  onSystemClick: (system: ComputationalSystemData | null, isShiftClick: boolean) => void;
  onSceneReady: (scene: THREE.Scene) => void;
}

export const ThreeVisualization: React.FC<ThreeVisualizationProps> = ({
  systems,
  selectedSystem,
  selectionQueue,
  onSystemClick,
  onSceneReady
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const clockRef = useRef<THREE.Clock | null>(null);
  const raycasterRef = useRef<THREE.Raycaster | null>(null);
  const mouseRef = useRef<THREE.Vector2 | null>(null);
  const linesRef = useRef<THREE.LineSegments | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    camera.position.set(0, 15, 50);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controlsRef.current = controls;

    // Lighting
    scene.add(new THREE.AmbientLight(0xcccccc, 1.5));
    scene.add(new THREE.DirectionalLight(0xffffff, 2.0));

    // Initialize utilities
    clockRef.current = new THREE.Clock();
    raycasterRef.current = new THREE.Raycaster();
    mouseRef.current = new THREE.Vector2();

    // Lines for connections
    const lineGeometry = new THREE.BufferGeometry();
    const lineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.7
    });
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(lines);
    linesRef.current = lines;

    // Mouse click handler
    const handleClick = (event: MouseEvent) => {
      if (!raycasterRef.current || !cameraRef.current || !mouseRef.current) return;

      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
      const intersects = raycasterRef.current.intersectObjects(scene.children);

      if (intersects.length > 0 && intersects[0].object.userData.system) {
        const clickedSystem = intersects[0].object.userData.system as ComputationalSystemData;
        onSystemClick(clickedSystem, event.shiftKey);
      } else {
        onSystemClick(null, false);
      }
    };

    // Resize handler
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('click', handleClick);
    window.addEventListener('resize', handleResize);

    // Notify parent that scene is ready
    onSceneReady(scene);

    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [onSystemClick, onSceneReady]);

  // Create meshes for systems that don't have them
  useEffect(() => {
    if (!sceneRef.current) return;

    console.log('Creating meshes for', systems.length, 'systems');
    
    systems.forEach(system => {
      if (!system.mesh) {
        console.log('Creating mesh for system', system.id, 'at position', system.position);
        
        const color = new THREE.Color().setHSL(Math.random(), 0.8, 0.6);
        const material = new THREE.MeshStandardMaterial({
          color,
          emissive: color,
          emissiveIntensity: 0.4,
          metalness: 0.3,
          roughness: 0.5,
          transparent: true,
          opacity: 0.9
        });
        
        // Use different geometries based on system type
        let geometry: THREE.BufferGeometry;
        if (system.systemType === 'text') {
          geometry = new THREE.SphereGeometry(1.5, 16, 16); // Spheres for text systems
        } else {
          geometry = new THREE.TetrahedronGeometry(1.5, 0); // Tetrahedrons for function systems
        }
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(system.position);
        mesh.userData.system = system;
        
        system.mesh = mesh;
        sceneRef.current!.add(mesh);
        
        console.log('Added mesh to scene, scene children count:', sceneRef.current!.children.length);
      }
    });
  }, [systems]);

  // Animation loop
  useEffect(() => {
    const animate = () => {
      if (!sceneRef.current || !rendererRef.current || !cameraRef.current || !clockRef.current) {
        return;
      }

      const deltaTime = clockRef.current.getDelta();

      // Update physics and render
      updatePhysics(deltaTime);
      updateVisualFeedback();

      if (controlsRef.current) {
        controlsRef.current.update();
      }

      rendererRef.current.render(sceneRef.current, cameraRef.current);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [systems, selectedSystem, selectionQueue]);

  const updatePhysics = (deltaTime: number) => {
    if (!linesRef.current) return;

    const linePoints: THREE.Vector3[] = [];
    const lineColors: number[] = [];
    const attractiveColor = new THREE.Color(0x00ff00);

    // Update system physics and connections
    for (let i = 0; i < systems.length; i++) {
      for (let j = i + 1; j < systems.length; j++) {
        const sysA = systems[i];
        const sysB = systems[j];

        // Simple similarity calculation (placeholder)
        const similarity = 0.8; // This would use the actual CQE comparison
        const forceMag = (similarity - 0.5) * 25.0;
        
        const distVec = new THREE.Vector3().subVectors(sysB.position, sysA.position);
        const distSq = Math.max(distVec.lengthSq(), 4);
        const forceDir = distVec.normalize();
        const finalForce = forceDir.multiplyScalar(forceMag / distSq);

        sysA.acceleration.add(finalForce);
        sysB.acceleration.sub(finalForce);

        if (similarity > 0.9) {
          linePoints.push(sysA.position, sysB.position);
          lineColors.push(
            attractiveColor.r, attractiveColor.g, attractiveColor.b,
            attractiveColor.r, attractiveColor.g, attractiveColor.b
          );
        }
      }
    }

    // Update system positions
    systems.forEach(system => {
      system.velocity.add(system.acceleration.clone().multiplyScalar(deltaTime));
      system.velocity.multiplyScalar(0.96);
      system.position.add(system.velocity.clone().multiplyScalar(deltaTime));
      system.acceleration.set(0, 0, 0);

      if (system.mesh) {
        system.mesh.position.copy(system.position);
        system.mesh.rotation.x += system.velocity.y * 0.1;
        system.mesh.rotation.y += system.velocity.x * 0.1;
      }
    });

    // Update connection lines
    linesRef.current.geometry.setFromPoints(linePoints);
    linesRef.current.geometry.setAttribute(
      'color',
      new THREE.Float32BufferAttribute(lineColors, 3)
    );
  };

  const updateVisualFeedback = () => {
    systems.forEach(system => {
      if (!system.mesh) return;

      const isSelected = selectedSystem === system;
      const isInQueue = selectionQueue.includes(system);
      
      const material = system.mesh.material as THREE.MeshStandardMaterial;
      if (isSelected) {
        material.emissiveIntensity = 1.0;
      } else if (isInQueue) {
        material.emissiveIntensity = 0.7;
      } else {
        material.emissiveIntensity = 0.4;
      }
    });
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full z-0 cursor-pointer"
    />
  );
};