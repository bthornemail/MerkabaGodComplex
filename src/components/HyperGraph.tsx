import { useContext, useRef, useEffect } from "react";
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ControllerContext } from "../hooks/useController";
import { ZeroGraphContext } from "../hooks/useZeroGraph";
export default function HyperGraph() {
    const {
        error,
        setError,
        isLoading,
        useContextualSearch,
        selectedNode,
        searchResults,
        setUseContextualSearch,
        setSelectedNode,
        setSearchResults,
        setIsLoading,
    } = useContext(ControllerContext);

    // ZeroGraph hooks
    const {
        entries, database, query,
        hypergraph, nodes,
        addEntry, setQuery,
        // hypergraph, nodes, wallet,
        searchWithContext, searchInNode,
        deserialize, serialize, syncPersonalGraph,
        getHypergraphStats, findSimilarNodes
    } = useContext(ZeroGraphContext);
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
    useEffect(() => {
        if (!sceneRef.current || !searchResults || searchResults.size === 0) return;

        // Clear existing search result objects
        const objectsToRemove: THREE.Object3D[] = [];
        sceneRef.current.traverse((child) => {
            if (child.userData?.type === 'searchResult') {
                objectsToRemove.push(child);
            }
        });
        objectsToRemove.forEach(obj => sceneRef.current!.remove(obj));

        // Add new search result objects
        Array.from(searchResults.entries()).forEach(([entry, score]: any) => {
            const sphere = new THREE.Mesh(
                new THREE.SphereGeometry(1, 32, 32),
                new THREE.MeshStandardMaterial({ color: 0x00ff00 })
            );
            sphere.scale.set(score.toFixed(3), score.toFixed(3), score.toFixed(3));
            sphere.position.set(
                Math.random() * 10 - 5,
                Math.random() * 5,
                Math.random() * 5 - 2.5
            );
            sphere.userData = { ...entry, type: 'searchResult' };
            sceneRef.current!.add(sphere);
        });
    }, [searchResults]);
    useEffect(() => {
        if (!sceneRef.current || !entries || entries.length === 0) return;

        // Clear existing entry objects
        const objectsToRemove: THREE.Object3D[] = [];
        sceneRef.current.traverse((child) => {
            if (child.userData?.type === 'entry') {
                objectsToRemove.push(child);
            }
        });
        objectsToRemove.forEach(obj => sceneRef.current!.remove(obj));

        // Add new entry objects
        Array.from(entries).forEach(([entry, score]: any) => {
            console.log(entry, score);
            const sphere = new THREE.Mesh(
                new THREE.SphereGeometry(1, 32, 32),
                new THREE.MeshStandardMaterial({ color: 0xffff00 })
            );
            sphere.position.set(
                Math.random() * 10 - 5,
                Math.random() * 5,
                Math.random() * 5 - 2.5
            );
            sphere.userData = { ...entry, type: 'entry' };
            sceneRef.current!.add(sphere);
        });
    }, [entries]);
    // useEffect(() => {
    //     database.forEach((entry: {
    //         id: string,
    //         buffer: any,
    //         vector: number[],
    //         metadata: any
    //     }, index: number) => {
    //         const sphere = new THREE.Mesh(
    //             new THREE.SphereGeometry(1, 32, 32),
    //             new THREE.MeshStandardMaterial({ color: 0xffff00 })
    //         )
    //         sphere.position.set(
    //             Math.random() * 10 - 5,
    //             Math.random() * 5,
    //             Math.random() * 5 - 2.5
    //         )
    //         sphere.userData = entry
    //         setScene((scene) => {
    //             scene.add(sphere);
    //             return scene;
    //         });
    //     })
    //     console.log(
    //         {
    //             entries, database, query,
    //             hypergraph, nodes
    //         })
    // }, [database]);
    
    useEffect(() => {
        console.log({ entries, database, query, hypergraph, nodes })
    }, [entries, database, query, hypergraph, nodes]);

    return (<div style={{ width: "100%", height: "100%" }}>
        {isLoading && <div className="zg-loading">Searching...</div>}
        {error && <div className="zg-error">{error}</div>}
        <div ref={containerRef}></div>
        {/* <Button onClick={() => add(HDNodeWallet.createRandom())}>Random</Button> */}
    </div>);
}