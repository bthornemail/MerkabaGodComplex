import { useNavigate } from "react-router-dom";

export default function Header() {
    const navigate = useNavigate();
    return (
    <header className="center mb-2"  onClick={() => {
      navigate("/");
  }}>
      <h1 className="card-title"><a href="#" className="navbar-brand">
        
        {/* <img src="placeholder-pin-svgrepo-com.svg" alt="Logo" width="36" onChangeCapture={() => dialog.current.showModal()} /> */}
      </a>L<img src="targeting-target-svgrepo-com.svg" alt="Logo" width="28" style={{paddingBottom:"6px"}} />CALS 2D</h1>
      <p className="card-subtitle">A Immutable Decentralized Social Network</p>
      <sub className="card-footer">Promoting Private, Public, & Protected Self-Managed Data</sub>
    </header>)
}