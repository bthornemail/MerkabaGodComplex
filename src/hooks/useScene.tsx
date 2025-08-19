import * as THREE from 'three'
import { useRef, createContext, useEffect } from 'react';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { HDNodeWallet } from 'ethers';
export const SceneContext = createContext<any>(null);

// 3. Provider Component
export const SceneProvider = ({ children }: any) => {
  const contextValues = useScene(); // Use the custom hook here

  return (
    <SceneContext.Provider value={contextValues}>
      {children}
    </SceneContext.Provider>
  );
};
export const useScene = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animationIdRef = useRef<number | null>(null);
  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Three.js objects
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    const controls = new OrbitControls(camera, renderer.domElement);

    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;
    controlsRef.current = controls;

    function resizeRendererToDisplaySize() {
      const width = containerRef.current?.parentElement?.clientWidth ?? window.innerWidth;
      const height = containerRef.current?.parentElement?.clientHeight ?? window.innerHeight;

      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
    
    resizeRendererToDisplaySize();
    containerRef.current.appendChild(renderer.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);

    camera.position.z = 10;

    function animate() {
      animationIdRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', resizeRendererToDisplaySize);

    return () => {
      window.removeEventListener('resize', resizeRendererToDisplaySize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      controls.dispose();
    };
  }, []);
  const add = (wallet: HDNodeWallet) => {
    if (!sceneRef.current) return;
    
    const group = new THREE.Group();
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 32),
      new THREE.MeshStandardMaterial({ color: 0x00ff00 })
    );
    
    group.add(sphere);
    group.name = wallet?.address;
    group.userData = { address: wallet?.address, privateKey: wallet?.privateKey, type: 'wallet' };
    sphere.userData = { address: wallet?.address, privateKey: wallet?.privateKey, type: 'wallet' };
    sphere.name = wallet?.address;
    sphere.position.set(0, 0, 0);
    sphere.scale.set(1, 1, 1);
    sphere.rotation.set(0, 0, 0);
    
    group.position.set(
      Math.random() * 10 - 5,
      Math.random() * 5,
      Math.random() * 5 - 2.5
    );
    
    sceneRef.current.add(group);
  }
  
  return { containerRef, scene: sceneRef.current, add } as const;
};