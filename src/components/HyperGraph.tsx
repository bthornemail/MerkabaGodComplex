import { useContext } from "react";
import * as THREE from 'three'
import { useRef, createContext, useEffect, useState } from 'react';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { HDNodeWallet } from 'ethers';
import { ControllerContext } from "../hooks/useController";
import { Button } from "react-bootstrap";
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
    const [scene, setScene] = useState<THREE.Scene>(new THREE.Scene());
    const camera = new THREE.PerspectiveCamera(75, containerRef.current?.parentElement?.clientWidth! / containerRef.current?.parentElement?.clientHeight!, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    const controls = new OrbitControls(camera, renderer.domElement);

    useEffect(() => {
        if (!containerRef.current) return;
        // renderer.setClearColor(0x00FF00, .15); // fully transparent background
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

            controls.update()
            renderer.render(scene, camera)
        }
        animate()
    }, []);
    useEffect(() => {
        {
            Array.from(searchResults.entries()).forEach(([entry, score]: any, index: number) => {
                const sphere = new THREE.Mesh(
                    new THREE.SphereGeometry(1, 32, 32),
                    new THREE.MeshStandardMaterial({ color: 0x00ff00 })
                )
                sphere.scale.set(score.toFixed(3), score.toFixed(3), score.toFixed(3))
                sphere.position.set(
                    Math.random() * 10 - 5,
                    Math.random() * 5,
                    Math.random() * 5 - 2.5
                )
                sphere.userData = entry
                setScene((scene) => {
                    scene.add(sphere);
                    return scene;
                });
            })
        }
    }, [searchResults]);
    useEffect(() => {
        {
            Array.from(entries).forEach(([entry, score]: any, index: number) => {
                console.log(entry,score)
                const sphere = new THREE.Mesh(
                    new THREE.SphereGeometry(1, 32, 32),
                    new THREE.MeshStandardMaterial({ color: 0x00ff00 })
                )
                // sphere.scale.set(score.toFixed(3), score.toFixed(3), score.toFixed(3))
                sphere.position.set(
                    Math.random() * 10 - 5,
                    Math.random() * 5,
                    Math.random() * 5 - 2.5
                )
                sphere.userData = entry
                setScene((scene) => {
                    scene.add(sphere);
                    return scene;
                });
            })
        }
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