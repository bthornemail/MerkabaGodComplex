// import { useWallet } from "../hooks/useWallet";

import { Attributes } from "graphology-types";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { ProtocolContext } from "../hooks/network/useProtocol";

export type LAYER_PROTOCOL = Record<string, {
    details: {
        author: string,
        title: string,
        summary: string,
        version: string
    }
} & Attributes>// & Record<string, Attributes>;

export type PROTOCOL = Record<string, {
    layers: LAYER_PROTOCOL
} & Attributes>// & Record<string, Attributes>;
export default function Controller() {
    const protocol = useContext(ProtocolContext);
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
    const protocolLayersDictionary: LAYER_PROTOCOL = {
        "bytes": {
            details: {
                author: "local2d",
                title: "bytes",//"Bytes",
                summary: "Media",
                version: "0.0.0"
            }
        },
        "documents": {
            details: {
                author: "local2d",
                title: "documents",
                summary: "Documents",
                version: "0.0.0"
            }
        },
        "assets": {
            details: {
                author: "local2d",
                title: "assets",
                summary: "Assets",
                version: "0.0.0"
            }
        },
        "services": {
            details: {
                author: "local2d",
                title: "services",
                summary: "Services",
                version: "0.0.0"
            }
        }

    };
    // console.log("subscriptions", subscriptions)
    console.log("protocol", protocol ?? protocol)
    // console.log("graph", graph)
    // console.log("connections", connections)
    return (<div style={{ minWidth: "fit-content" }}>
        <hr />
        <div style={{ display: "flex", paddingBottom: ".5rem", gap: "2rem", overflowX: "auto", width: "100vw" }}>
            <label htmlFor="connections-bar">Connections</label>
            <div className="input-group" style={{ minWidth: "fit-content", border: "rgba(0,0,0,0.55)" }}>
                    {/* <div id="connections-bar" className="input-group" style={{ minWidth: "fit-content", border: "rgba(0,0,0,0.55)" }}>
                        {Object.entries(protocol).map(([layer, attributes], index) => <button key={index} className={`btn btn-sm btn-outline-${Object.entries(colors)[index][0]} rounded-3  me-2`} onClick={() => setIndex(layer)}>{attributes.details.title}</button>)}
                    </div> */}
            </div>
            <label htmlFor="connections-bar">Protocols</label>
            <div id="connections-bar" className="input-group" style={{ minWidth: "fit-content", border: "rgba(0,0,0,0.55)" }}>
                {Object.entries(protocolLayersDictionary).map(([protocol, attributes], index) => {
                    return protocol.split("/").map((path)=>{
                        return <Link key={index} to={protocol}>
                            <button key={index} className={`btn btn-sm btn-outline-${Object.entries(colors)[index][0]} rounded-3  me-2`} onClick={() => console.log(protocol)}>{attributes.details.title}</button>
                            </Link>
                    })
                })}
            </div>
        </div>
    </div>)
}