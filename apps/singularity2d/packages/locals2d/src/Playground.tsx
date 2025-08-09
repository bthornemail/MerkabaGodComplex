// App.tsx
import React, { useEffect, useRef } from 'react'
import { WalletVisualizer } from './WalletVisualizer'
import * as THREE from 'three'
import { Wallet } from 'ethers'

const mqttBroker = 'ws://localhost:9001' // Replace with your broker

export default function Playground() {
  const containerRef = useRef<HTMLDivElement>(null)
  const visualizerRef = useRef<WalletVisualizer | null>(null)

  useEffect(() => {
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    containerRef.current?.appendChild(renderer.domElement)

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
    directionalLight.position.set(5, 10, 7.5)
    scene.add(directionalLight)

    camera.position.z = 10

    const visualizer = new WalletVisualizer(scene, mqttBroker)
    visualizerRef.current = visualizer

    function animate() {
      requestAnimationFrame(animate)
      renderer.render(scene, camera)
    }
    animate()
  }, [])

  const handleCreateWallet = () => {
    visualizerRef.current?.createWalletGroup()
  }

  const handleAddChild = () => {
    const parent = Array.from(visualizerRef.current?.walletGroups.keys() || [])[0]
    if (!parent) return
    const child = Wallet.createRandom()
    visualizerRef.current?.addChildToWallet(parent, child.privateKey)
    visualizerRef.current?.broadcastChildWallet(parent, child)
  }

  return (
    <>
      <div style={{ position: 'absolute', zIndex: 1, padding: 10 }}>
        <button onClick={handleCreateWallet}>Create Wallet</button>
        <button onClick={handleAddChild}>Add Child Wallet</button>
      </div>
      <div ref={containerRef} style={{ width: '100vw', height: '100vh' }} />
    </>
  )
}
