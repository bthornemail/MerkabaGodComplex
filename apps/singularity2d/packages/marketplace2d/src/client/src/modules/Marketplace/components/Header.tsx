import { Link } from "react-router-dom";
import { Image } from "react-bootstrap";

const Header = () => {
  return (<header className="marketplace-header">
    <Link to="/"><Image src="/src/images/color-lineal-marketplace-svgrepo-com.svg" alt="Logo" width={144} /></Link>
    <h1 className="text-light">Marketplace 2D</h1>
    <p className="text-dark">A decentralized marketplace</p>
    <Link to="Listings"><div className="btn btn-outline-light">View Listings</div></Link>
  </header>);
};

export default Header;
