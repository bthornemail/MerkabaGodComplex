/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-case-declarations */
/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useState } from 'react'
// import App from './App.tsx'
import { ForceGraph3D } from 'react-force-graph';
import { useRef } from 'react'
import * as THREE from 'three';
import './Graph.css'
import postData from '../bin/post.data.ts';
// import socialMediaData from './datasets/social.media.json';
// import userProfileData from './datasets/cloud.user.json';
import RegisterAsset from '../templates/Register.Asset.tsx';
import useMqttChat from '../hooks/useMqttChat.tsx';
import formatNode from '../bin/format.node.ts';
import { useGraph } from '../hooks/useGraph.tsx';
import { useUser } from '../hooks/useUser.tsx';
export type NODE_GRAPH = { nodes: any[], links: any[] }
export type NODE_GRAPH_NODE = { node: Record<string, any>, link: Record<string, any> }
export type GRAPH_DATA = { nodes: any[], links: any[] }
import SpriteText from 'three-spritetext';
let count = 0
export default function Graph(props?: { path?: string, name?: string }) {
    const graphRef = useRef<any>();
    const dialogModal = useRef<HTMLDialogElement>(null);
    const graphContatinerRef = useRef<HTMLDivElement>(null);
    const [viewToggle, setViewToggle] = useState<boolean>(false);
    const { graphData, updateGraphData } = useGraph()
    const { addTopic } = useMqttChat({ graphData, updateGraphData });
    // const { subscriptions,addTopic,removeTopic } = useMqttChat({ graphData, updateGraphData });
    const [size,] = useState(24)
    const {
        user,
        // save,
        // status,
        // signIn,
        // signUp,
        // signOut,
        // verifyMessage
    } = useUser()
    /*      async function getUserData() {
                // const data = await postData("src/datasets/cloudy.day.vault.json", { answer: 42 })
                // const marketplaceData = await postData("src/datasets/marketplace.json", { answer: 42 })
                // const accountManagerData = await postData("src/datasets/account.manager.json", { answer: 42 })
                const socialMediaData = await postData("src/datasets/social.media.json", { answer: 42 })
                const userProfileData = await postData("src/datasets/cloud.user.json", { answer: 42 })
                return {
                      nodes: [...socialMediaData.nodes, ...userProfileData.nodes],
                      links: [...socialMediaData.links, ...userProfileData.links]
                }
          }
    */
    /*      async function getHeliaNode() {
                if (!helia) throw new Error("No Helia");
                return {
                      nodes: [{
                            id: "Helia_Libp2p_PeerId",
                            "img": "avatar-education-id-card-svgrepo-com.svg",
                            name: helia.libp2p.peerId,
                            title: "Peer Id",
                            summary: helia.libp2p.peerId,
                            color: "yellow",
                            "val": 10
                      }],
                      links: [
                            {
                                  "source": "Vault_User",
                                  "target": "Helia_Libp2p_PeerId"
                            }]
                }
          }
      
    /*      useEffect(() => {
                (async () => {
                      try {
                            await updateGraphData(await getUserData())
                      } catch (error) {
                            console.error(error)
                      }
                })()
                }, [user])
    */
    /*
    useEffect(() => {
                (async () => {
                      try {
                            await updateGraphData(await getHeliaNode())
                      } catch (error) {
                            console.error(error)
                      }
                })()
          }, [helia])
    */
    async function handleClick(node: any) {
        const id = count++
        switch (node.id) {
            case "Register_Asset":
                const _nodes = [formatNode({
                    "id": "vault_ai:asset:" + id,
                    "img": "availability-svgrepo-com.svg",
                    "name": "New Asset",
                    "title": "New Asset",
                    "color": "yellow",
                    "val": 10
                }, 'asset')]
                const _links = [{
                    "source": "Register_Asset",
                    "target": "vault_ai:asset:" + id,
                    "color": "red"
                }]
                await updateGraphData({ nodes: _nodes, links: _links })
                break;

            default:
                dialogModal.current?.showModal()
                break;
        }
        // console.log(node)
    }
    const handleRightClick = useCallback((node: any) => {
        // Aim at node from outside it
        const distance = 150;
        const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

        graphRef.current.cameraPosition(
            { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }, // new position
            node, // lookAt ({ x, y, z })
            2000  // ms transition duration
        );
    }, []);
    // const handleBackgroundRightClick = useCallback(async (event: any) => {
    //       console.log({ event })
    //       // await updateGraphData({
    //       //       nodes: [formatNode({
    //       //             "img": "availability-svgrepo-com.svg",
    //       //             "name": "New Node",
    //       //             "title": "New Node",
    //       //             "color": "yellow",
    //       //             "val": 10,
    //       //             "x": event.x,
    //       //             "y": event.y
    //       //       })],
    //       //       links: []
    //       // });
    //       setViewToggle(!viewToggle)
    //       graphRef.current?.refresh()
    // }, []);
    function handleBackgroundRightClick(event: any) {
        console.log({ event })
        // await updateGraphData({
        //       nodes: [formatNode({
        //             "img": "availability-svgrepo-com.svg",
        //             "name": "New Node",
        //             "title": "New Node",
        //             "color": "yellow",
        //             "val": 10,
        //             "x": event.x,
        //             "y": event.y
        //       })],
        //       links: []
        // });
        setViewToggle(!viewToggle)
        graphRef.current?.refresh()
    }
    async function handleBackgroundClick(event: any) {
        console.log({ event })
        const newTopicTitle = window.prompt("Enter Topic Title");
        if (!newTopicTitle) throw new Error("No Topic Entered");
        const topic = newTopicTitle.split(":")[0] === "Social_Media"
            ? newTopicTitle
            : `Social_Media:${newTopicTitle}`
        await addTopic(topic)
        graphRef.current?.refresh()
    }
    return (<>
        <div ref={graphContatinerRef} className={props?.name ?? "custom_force_graph"} >
            <ForceGraph3D
                ref={graphRef}
                width={graphContatinerRef.current?.clientWidth}
                // width={graphContatinerRef.current?.clientWidth && graphContatinerRef.current?.clientWidth * .90}
                height={graphContatinerRef.current?.clientHeight}
                // height={graphContatinerRef.current?.clientHeight && graphContatinerRef.current?.clientHeight * .90}
                graphData={graphData}
                // backgroundColor={"rgba(0,0,0,1)"}
                nodeRelSize={24}
                nodeLabel={"label"}
                nodeId={'id'}
                linkWidth={4}
                linkOpacity={0.5}
                // cooldownTicks={400}
                // onEngineStop={() => {
                //       graphRef.current?.zoomToFit()
                // }}
                warmupTicks={1}
                nodeAutoColorBy="domain"
                onNodeClick={handleClick}
                onNodeRightClick={handleRightClick}
                onBackgroundClick={handleBackgroundClick}
                onBackgroundRightClick={handleBackgroundRightClick}
                nodeThreeObject={({ id, color, img }) => {
                    const imgTexture = new THREE.TextureLoader().load(`${img}`);
                    imgTexture.colorSpace = THREE.SRGBColorSpace;
                    const material = new THREE.SpriteMaterial({ map: imgTexture });
                    const sprite = new THREE.Sprite(material);
                    sprite.scale.set(size, size, size);

                    const myText = new SpriteText(id);
                    myText.color = color ? color : "black";
                    myText.textHeight = 8;
                    return viewToggle ? myText : sprite;
                }}
            />
            <dialog ref={dialogModal}>
                <RegisterAsset />
                <button className='btn btn-danger' onClick={() => dialogModal.current?.close()}>Close</button>
            </dialog>
        </div></>)
}
