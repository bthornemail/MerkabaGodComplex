// import { useWallet } from "../hooks/useWallet";

import { Attributes } from "graphology-types";
import { useContext, useState } from "react";
import { ProtocolContext } from "../hooks/network/useProtocol";
import { PeerContext } from "../hooks/hypergraph/usePeer";
import { Accordion, Button, ListGroup, ListGroupItem, Offcanvas } from 'react-bootstrap';
import lockImage from "../assets/login-svgrepo-com.svg";
import Peer from "./Peer";
import GraphSideBar from "./SideBar/GraphSideBar";
import EdgeSideBar from "./SideBar/EdgeSideBar";
import NodeSideBar from "./SideBar/NodeSideBar";
import PeerSideBar from "./SideBar/PeerSideBar";

const colors: Record<string, Attributes> = {
    "primary": {
        details: {
            author: "local2d",
            title: "primary",
            summary: "TODO",
            version: "0.0.0"
        }
    },
    "secondary": {
        details: {
            author: "local2d",
            title: "secondary",
            summary: "TODO",
            version: "0.0.0"
        }
    },
    "success": {
        details: {
            author: "local2d",
            title: "success",
            summary: "TODO",
            version: "0.0.0"
        }
    },
    "warning": {
        details: {
            author: "local2d",
            title: "warning",
            summary: "TODO",
            version: "0.0.0"
        }
    },
    "dark": {
        details: {
            author: "local2d",
            title: "dark",
            summary: "TODO",
            version: "0.0.0"
        }
    },
    "info": {
        details: {
            author: "local2d",
            title: "info",
            summary: "TODO",
            version: "0.0.0"
        }
    }

};

export default function Controller() {
    const { wallet } = useContext(PeerContext);
    const {
        entity, identity,
        options, attributes,
        layers, links,
        transform, translate, push, pull
    } = useContext(ProtocolContext);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [activeKey, setActiveKey] = useState<string>("");
    return (<div className="input-group" style={{ minWidth: "fit-content" }}>
        <hr />
        <div style={{ display: "flex", paddingBottom: ".5rem", gap: "2rem", overflowX: "auto", width: "100vw", alignItems: "center" }}>
            <div >
                <button type="button" className="btn btn-outline-light" onClick={handleShow}>
                    <img src={lockImage} width="24px" />
                </button>
                <GraphSideBar placement={"top"} handleClose={handleClose} show={show} activeKey={activeKey}/>
                <NodeSideBar placement={"start"} handleClose={handleClose} show={show} activeKey={activeKey}/>
                <EdgeSideBar placement={"end"} handleClose={handleClose} show={show} activeKey={activeKey}/>
                <PeerSideBar placement={"bottom"} handleClose={handleClose} show={show} activeKey={activeKey}/>
            </div>
            <>
        <label htmlFor="connections-bar">Protocols</label>
        <div id="connections-bar" className="input-group" style={{ minWidth: "fit-content", border: "rgba(0,0,0,0.55)" }}>
            {Object.entries(layers).map(([protocol, attributes], index) => {
                return <a key={index} href={protocol}><button key={index} className={`btn btn-sm btn-outline-${Object.entries(colors)[index % 6 ][0] || "light"} rounded-3  me-2`} onClick={() => console.log(protocol)}>{(attributes as any).details.title}</button></a>
            })}
        </div></>
        </div>
    </div>)
}