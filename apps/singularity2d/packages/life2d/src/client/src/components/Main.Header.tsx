/* eslint-disable @typescript-eslint/no-explicit-any */
// import {  useRef, useState } from "react";
// import { useContext, useRef, useState } from "react";
// import { UserContext } from "../provider/User.Provider";
import SplitButtonLink from "./Split.Button.Link";
import {  useNavigate } from "react-router-dom";
import RouterNavButton from "./Router.Nav.Button";
import { Link } from "react-router-dom";
// import { Link, useLocation } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import QRCode from 'react-qr-code';

export default function MainHeader() {
  // const { user, save, signIn, signOut, signUp, status }: any = useContext(UserContext);
  const { user, openLoginDialog, openUserProfileDialog }: any = useUser();
  // const location = useLocation()
  const navigate = useNavigate();

  function handleSplitRouteLink(topic: string,path: string){
    // navigate(`${path}/${topic}`);
   console.log(`Navigating to ${path}/${topic}`);
   if(topic === "Home"){ return navigate("/")}
   navigate(`${topic}`);
  }
  return (<div className="nav-bar-header">
    <div className="nav-brand input-group">
      {/* <RouterNavButton color="light-outline" href='/' value="Marketplace2D" /> */}
      <SplitButtonLink path="Peer-id" options={["Home","Day_Vault","Cloud_User","Vault_User"]} handleLink={handleSplitRouteLink}/>
      <RouterNavButton color="light" href='/network' value="Network"/>
      <RouterNavButton color="light" href='/graph' value="Graph"/>
      {/* <RouterNavButton color="light" href='/identity' value="Identity"/> */}
      {/* <RouterNavButton color="light" href='/store' value="Assets"/> */}
      <RouterNavButton color="light" href='/map' value="Map"/>
      <SplitButtonLink path="User" options={["Network","JSON_RPC_AI","Vault_Wallet"]} handleLink={handleSplitRouteLink}/>
      <RouterNavButton color="light" href='/marketplace' value="Marketplace" />
      <SplitButtonLink path="Environment" options={["Connections","Marketplace","Knowledge College","Social Network","AI_Node"]} handleLink={handleSplitRouteLink}/>
      {/* <RouterNavButton color="light" href='/listings' value="Listings" /> */}
      <SplitButtonLink path="Domain" options={["Graph","Listings","Wiki","Universal_Chat","RPC_Chat_Interface"]} handleLink={handleSplitRouteLink}/>
      {/* <RouterNavButton color="light" href='/listings/post' value="Post" /> */}
      <SplitButtonLink path="Content" options={["Node","Listing","Page","Topic","JSON_Node"]} handleLink={handleSplitRouteLink}/>
      {/* <RouterNavButton color="light" href='/listings/confirm' value="Confirm" /> */}
      {/* <RouterNavButton color="light" href={location.pathname} value={location.pathname.split("/")[4]} /> */}
    </div>
    <Link to="/map"><img src="/src/images/map-map-marker-svgrepo-com.svg" style={{ width: "2rem",marginRight:".5rem" }} /></Link>
    {!user
      ? <img src="/src/images/broken-zone-svgrepo-com.svg" onClick={openLoginDialog} style={{ width: "2rem" }} />
      : <QRCode value={user.address}  style={{ width: "3rem",height: "3rem" }}  onClick={openUserProfileDialog}/> //<><sub>...{user.address.slice(-6)}</sub><img src="/src/images/safe-zone-svgrepo-com.svg" onClick={openUserProfileDialog} style={{ width: "2rem" }} /></>
      // : <><sub>...{user.address.slice(-6)}</sub><img src="/src/images/safe-zone-svgrepo-com.svg" onClick={openUserProfileDialog} style={{ width: "2rem" }} /></>
    }
  </div>)
}