/* eslint-disable @typescript-eslint/no-explicit-any */
// import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
// import { Card } from 'react-bootstrap';
// import useMqttBroadcast from "../../../hooks/useMqttBroadcast";
import { useBroadcast } from "../../../hooks/useBroadcast";
import { useMqtt } from "../../../hooks/useMqtt";
import { BROADCAST, BROADCAST_MESSAGE } from "../../../provider/Broadcast.Provider";
export default function Listings() {
    const [listings, setListings] = useState<BROADCAST[]>([])
    const navigate = useNavigate()
    const location = useLocation()
    const { client } = useMqtt()
    const {
        message,
        messageQueue,
        // addChannel,
        // viewChannel,
        // currentChannel,
        // activeChannels
    } = useBroadcast()

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
    useEffect(() => {
        console.log(message)
        if (!message) return;
        if (!message.topic) return;
        if (!message.message.title) return;
        const listings: BROADCAST[] = messageQueue.map((message: BROADCAST_MESSAGE) => {
            console.log(message.message)
            return message.message
        })
        setListings(listings)
    }, [messageQueue])
    useEffect(() => {
        //get listings from db
        fetch('/src/datasets/listing.json')
            .then(res => { console.log(res); return res })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                if (data) {
                    setListings(data.map((node: any) => {
                        console.log(node)
                        return { title: node.title, summary: node.name, description: node.id, imgSrc: `/src/images/${node.img}`, value: node.val }


                    }))
                }
            }
            )
    }, [])
    return (<div className="marketplace-listings" >
        {listings.map(({ title, summary, description, imgSrc, value }: BROADCAST, index: number) => {
            return <div onClick={() => navigate(title)} key={index} className="card">
                <div className="card-header">
                    {!imgSrc ? <></> : <div className="card-image">
                        <img style={{ width: "100%", maxWidth: "200" }} className="card-image" src={imgSrc} />
                    </div>}
                    <div className="card-title">{title}</div>
                    <strong>{value}</strong>
                    <br />
                    <small>{".location"} </small>
                </div>
                <div className="card-body">
                    <div className="card-text">
                        {summary}
                    </div>
                    <div className="card-text">
                        {description}
                    </div>
                    <div className="card-text">
                    </div >
                </div>
                <div className="card-footer">
                    {"listing.author"}
                    <small>{new Date("listing.timestamp").toLocaleString()}</small>
                    <p style={{ fontSize: "8px" }}>{"listing.id"}</p>
                </div>
            </div>
            // return <Card key={index} onClick={() => { navigate(title) }}>
            //     <Card.Img src={imgSrc} />
            //     <Card.Body>
            //         <Card.Title>{title}</Card.Title>
            //         <Card.Subtitle>{summary}</Card.Subtitle>
            //         {description}
            //     </Card.Body>
            //     {value && <Card.Footer style={{ textWrap: "nowrap", overflowX: "auto", overflowY: "hidden" }}>Value: {value}</Card.Footer>}
            // </Card>
        })}
    </div>)
}