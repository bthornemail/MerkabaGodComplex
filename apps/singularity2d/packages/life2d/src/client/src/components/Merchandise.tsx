import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card } from 'react-bootstrap';
import './Store.css'
import { socket } from "../services/socket";

export type MERCANDISE_LISTING = { id: string, title: string, content?: string, summary?: string, description?: string, image?: string, value: string, author: string }

export default function Merchandise() {
    const [merchandise, setMerchandise] = useState<MERCANDISE_LISTING>()
    const { merchaniseId } = useParams()
    useEffect(() => {
        //get listings from db
        // fetch(`/src/data/${merchaniseId}.json`)
        //     .then(res => res.json())
        //     .then(data => setMerchandise(data.map((node: MERCANDISE_LISTING) => { //BROADCAST)=>{
        //         // alert(JSON.stringify(node))
        //         return { title: node.title, summary: node.summary, description: node.description, image: `/src/images/${node.image?.trim()}`, content: node.content, author: node.author, id: node.id }
        //     })))
        socket.emit("get", merchaniseId, (merchandise: MERCANDISE_LISTING) => {
            setMerchandise(merchandise)
        })
    }, [])
    return (<Card>
        <div className="card-header" style={{ display: "flex", flexDirection: "row" }}>
                <div>
                    {!merchandise?.image ? <></> : <div className="card-image">
                        <img style={{ width: "100%", maxWidth: "100px" }} className="card-image" src={merchandise?.image} />
                    </div>}
                    <div className="card-title">{merchandise?.title}</div>
                    <strong>{merchandise?.value}</strong>
                    <small>{".location"} </small>
                </div>
            </div>
            <div className="card-body" >
                <p className="card-text" style={{ fontSize: ".75rem", textAlign: "justify" }}>
                    {merchandise?.summary}
                </p>
                <p className="card-text" style={{ fontSize: ".75rem", textAlign: "justify" }}>
                    {merchandise?.description && merchandise.description.slice(0, 20)}
                </p>
            </div>
            <div className="card-footer">
                <p style={{ fontSize: ".50rem", textAlign: "center", marginBottom: "-.25rem" }}>
                    {merchandise?.id}
                    <br />
                    {merchandise?.author}
                    <br />
                    {new Date(Date.now()).toLocaleString()}
                </p>
            </div>
    </Card>)
}