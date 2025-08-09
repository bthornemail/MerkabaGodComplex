/* eslint-disable @typescript-eslint/no-explicit-any */
// import {  useState} from 'react'
import { Link } from "react-router-dom";

export default function RouterNavButton(props: any) {
  if(!props.value) return (<></>);
  if(props.value === "Marketplace2D"){
    return <Link style={{ marginRight:"8px",padding:"0",display: "flex",flexDirection:"column",justifyContent: "center", alignItems: "center" }} to={props.href} className={`btn btn-${props.color ?? "primary"}`}>
      <img src="/src/images/color-lineal-marketplace-svgrepo-com.svg" width="28px"/>
      <span style={{fontSize: "6px"}}>{props.value}</span>
      </Link>
  }
  return <Link style={{ display: "flex", justifyContent: "center", alignItems: "center" }} to={props.href} className={`btn btn-${props.color ?? "primary"}`}>{props.value}</Link>
}