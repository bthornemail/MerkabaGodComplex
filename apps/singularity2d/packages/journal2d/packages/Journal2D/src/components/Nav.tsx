import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Nav() {
    const [currentLocation, setCurrentLocation] = useState("Los Angeles");
    return (<nav style={{ display: "flex", height: "3rem" }}>
      <Link to="/"><img src='/favicon.png' style={{ width: "2rem", height: "2rem" }} /></Link>
      <div onClick={() => setCurrentLocation("Los Angeles")}>
        <sup>location {">"}</sup>
        <p>{currentLocation}</p>
      </div>
    </nav>)
  }

  export function NavFooterButtons({buttons}) {
    const navigate = useNavigate()
    return buttons.map((button)=>{
      return <div style={{fontSize:".75rem",textAlign:"center"}} className="btn-secondary" onClick={()=>navigate(button.url)}>
      {/* <Link to="/"> */}
    <img src='/favicon.png' style={{ width: "1.5rem", height: "1.5rem" }} />
    <br />
    <sub>{button.title}</sub>
    {/* </Link> */}
    </div>
    })
  }

  export function NavFooter() {
    const buttons = [
      {title:"Search",url:"/"},
      {title:"Favorites",url:"/favorites"},
      {title:"Post",url:"/post"},
      {title:"Account",url:"/account"},
      {title:"Feedback",url:"/feedback"},
    ]
    return (<nav style={{ display: "flex", justifyContent:"space-around",height: "fit-content" }}>
      <NavFooterButtons buttons={buttons}/>
    </nav>)
  }