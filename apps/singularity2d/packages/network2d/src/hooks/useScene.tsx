import * as THREE from 'three'
import { useRef, createContext, useEffect, useState } from 'react';
import { HDNodeWallet } from 'ethers';

const mqttBroker = 'ws://localhost:9001' // Replace with your broker

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
  const [scene, setScene] = useState<THREE.Scene>(new THREE.Scene());
  const camera = new THREE.PerspectiveCamera(75, containerRef.current?.parentElement?.clientWidth! / containerRef.current?.parentElement?.clientHeight!, 0.1, 1000)
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  useEffect(() => {
    if (!containerRef.current) return;
    renderer.setClearColor(0x00FF00, .15); // fully transparent background
    function resizeRendererToDisplaySize() {
      const width = containerRef.current?.parentElement?.clientWidth ?? window.innerWidth;
      const height = containerRef.current?.parentElement?.clientHeight ?? window.innerHeight;

      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
    resizeRendererToDisplaySize(); // initial sizing
    window.addEventListener('resize', resizeRendererToDisplaySize);

    return () => window.removeEventListener('resize', resizeRendererToDisplaySize);
  }, []);
  useEffect(() => {
    // renderer.setSize(containerRef.current?.parentElement?.clientWidth!, containerRef.current?.parentElement?.clientHeight!)
    // renderer.setSize(window.innerWidth, window.innerHeight)
    containerRef.current?.appendChild(renderer.domElement)

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
    directionalLight.position.set(5, 10, 7.5)
    scene.add(directionalLight)

    camera.position.z = 10
    function animate() {
      requestAnimationFrame(animate)
      renderer.render(scene, camera)
    }
    animate()
  }, [])
  const add = (wallet: HDNodeWallet) => {
    const group = new THREE.Group()
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 32),
      new THREE.MeshStandardMaterial({ color: 0x00ff00 })
    )
    alert(`Created new group for ${wallet?.address}`)
    group.add(sphere)
    group.name = wallet?.address;
    group.userData = { address: wallet?.address, privateKey: wallet?.privateKey }
    group.children[0].userData = { address: wallet?.address, privateKey: wallet?.privateKey }
    group.children[0].name = wallet?.address;
    group.children[0].position.set(0, 0, 0)
    group.children[0].scale.set(1, 1, 1)
    group.children[0].rotation.set(0, 0, 0)
    group.position.set(
      Math.random() * 10 - 5,
      Math.random() * 5,
      Math.random() * 5 - 2.5
    )
    setScene((scene) => {
      scene.add(group);
      return scene;
    });
  }
  return { containerRef, scene, add } as const;
};