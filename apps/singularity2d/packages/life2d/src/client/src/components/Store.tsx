import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
// import { Card } from 'react-bootstrap';
// import useMqttBroadcast from "../../../hooks/useMqttBroadcast";
// import { useBroadcast } from "../hooks/useBroadcast";
import { useMqtt } from "../hooks/useMqtt";
import './Store.css'
import { useStore } from "../hooks/useStore";

export type STORE_LISTING = { id: string, title: string, content?: string, summary?: string, description?: string, image?: string, value: string, author: string }

export default function Store() {
    const [listings, setListings] = useState<STORE_LISTING[]>([])
    const navigate = useNavigate()
    const location = useLocation()
    const { client } = useMqtt()
    const { get, encode, put, blockstore, dag ,walkBlocks} = useStore()
    // const {
    //     message,
    //     messageQueue,
    //     // addChannel,
    //     // viewChannel,
    //     // currentChannel,
    //     // activeChannels
    // } = useBroadcast()

    useEffect(() => {
        (async () => {
            await client?.subscribeAsync(location.pathname.slice(1) + "/+")
            // await addChannel("Listings", location.pathname.slice(1))
            // console.log("location.pathname",location.pathname.slice(1))
            // await viewChannel("Listings")
            // console.log("activeChannels" ,activeChannels)
            // console.log("currentChannel",currentChannel)
        })()
        return () => {
            (async () => {
                await client?.unsubscribeAsync(location.pathname.slice(1) + "/+")
                // await addChannel("Listings", location.pathname.slice(1))
                // console.log("location.pathname",location.pathname.slice(1))
                // await viewChannel("Listings")
                // console.log("activeChannels" ,activeChannels)
                // console.log("currentChannel",currentChannel)
            })()
        }
    }, [client])
    // useEffect(() => {
    //     console.log(message)
    //     if (!message) return;
    //     if (!message.topic) return;
    //     if (!message.message.title) return;
    //     const listings: BROADCAST[] = messageQueue.map((message: BROADCAST_MESSAGE) => {
    //         console.log(message.message)
    //         return message.message
    //     })
    //     setListings(listings)
    // }, [messageQueue])
    useEffect(() => {
        //get listings from db
        fetch('/src/datasets/store.nodes.json')
            .then(res => res.json())
            .then(data => setListings(data.map((node: STORE_LISTING) => { //BROADCAST)=>{
                // alert(JSON.stringify(node))
                return { title: node.title, summary: node.summary, description: node.description, image: `/src/images/${node.image?.trim()}`, content: node.content, author: node.author, id: node.id }
            })))
    }, [])
    useEffect(() => {
        walkBlocks()
        //get listings from db
    }, [blockstore])
    return (<div className="store-listings" >
        {listings.map(({ title, summary, description, image, value, id, author }: STORE_LISTING, index: number) => {
            return <div onClick={() => navigate(id)} key={index} className="card">
                <div className="card-header" style={{ display: "flex", flexDirection: "row" }}>
                    <div>
                        {!image ? <></> : <div className="card-image">
                            <img style={{ width: "100%", maxWidth: "100px" }} className="card-image" src={image} />
                        </div>}
                        <div className="card-title">{title}</div>
                        <strong>{value}</strong>
                        <small>{".location"} </small>
                    </div>
                </div>
                <div className="card-body" >
                    <p className="card-text" style={{ fontSize: ".75rem", textAlign: "justify" }}>
                        {summary}
                    </p>
                    <p className="card-text" style={{ fontSize: ".75rem", textAlign: "justify" }}>
                        {description && description.slice(0, 20)}
                    </p>
                </div>
                <div className="card-footer">
                    <p style={{ fontSize: ".50rem", textAlign: "center", marginBottom: "-.25rem" }}>
                        {id}
                        <br />
                        {author}
                        <br />
                        {new Date(Date.now()).toLocaleString()}
                    </p>
                </div>
            </div>
        })}
    </div>)
}