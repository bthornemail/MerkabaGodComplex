import * as THREE from 'three'
import { Wallet } from 'ethers'
import mqtt from 'mqtt'
// Import remains the same...
type WalletGroup = {
  wallet: Wallet
  group: THREE.Group
  children: Wallet[]
}
export class WalletVisualizer {
  scene: THREE.Scene
  mqttClient: mqtt.MqttClient
  walletGroups: Map<string, WalletGroup>

  constructor(scene: THREE.Scene, mqttBroker: string) {
    this.scene = scene
    this.walletGroups = new Map()

    this.mqttClient = mqtt.connect(mqttBroker)
    this.setupMQTT()
  }

  setupMQTT() {
    this.mqttClient.on('connect', () => {
      console.log('[MQTT] Connected')
      this.mqttClient.subscribe('wallet/create')
      this.mqttClient.subscribe('wallet/+/child')
      this.mqttClient.subscribe('wallet/+/position')
    })

    this.mqttClient.on('message', (topic, message) => {
      const parts = topic.split('/')
      if (topic === 'wallet/create') {
        const { address, privateKey } = JSON.parse(message.toString())
        this.createWalletGroup(privateKey, address)
      }

      if (parts[2] === 'child') {
        const parent = parts[1]
        const { privateKey } = JSON.parse(message.toString())
        this.addChildToWallet(parent, privateKey)
      }

      if (parts[2] === 'position') {
        const address = parts[1]
        const { x, y, z } = JSON.parse(message.toString())
        const group = this.walletGroups.get(address)?.group
        if (group) group.position.set(x, y, z)
      }
    })
  }

  createWalletGroup(privateKey?: string, forceAddress?: string): string {
    const wallet = privateKey ? new Wallet(privateKey) : Wallet.createRandom()
    if (this.walletGroups.has(wallet.address)) return wallet.address

    const group = new THREE.Group()
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(1, 32, 32),
      new THREE.MeshStandardMaterial({ color: 0x00ff00 })
    )
    group.add(sphere)
    this.scene.add(group)

    group.position.set(
      Math.random() * 10 - 5,
      Math.random() * 5,
      Math.random() * 5 - 2.5
    )

    this.walletGroups.set(wallet.address, { wallet, group, children: [] })

    if (!privateKey) {
      this.mqttClient.publish(
        'wallet/create',
        JSON.stringify({ address: wallet.address, privateKey: wallet.privateKey })
      )
    }

    return wallet.address
  }

  addChildToWallet(parentAddress: string, childPrivateKey: string) {
    const groupData = this.walletGroups.get(parentAddress)
    if (!groupData) return

    const childWallet = new Wallet(childPrivateKey)
    groupData.children.push(childWallet)

    const childSphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.4, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0x0000ff })
    )

    const offset = groupData.children.length
    childSphere.position.set(offset * 1.5, 0, 0)
    groupData.group.add(childSphere)
  }

  broadcastChildWallet(parentAddress: string, childWallet: Wallet) {
    const topic = `wallet/${parentAddress}/child`
    this.mqttClient.publish(topic, JSON.stringify({ privateKey: childWallet.privateKey }))
  }

  broadcastPosition(address: string, pos: THREE.Vector3) {
    this.mqttClient.publish(
      `wallet/${address}/position`,
      JSON.stringify({ x: pos.x, y: pos.y, z: pos.z })
    )
  }
}
