import { Link } from "react-router-dom";
import { Image } from "react-bootstrap";

export default  function MarketplaceNav(){
  return (<nav className="navbar marketplace-nav">
    <div className="container">
      <Link to="/Marketplace" className="nav-link">
        <Image src="/src/images/color-lineal-marketplace-svgrepo-com.svg" width={"36px"} alt="logo" />
      </Link>
      <Link to="tokens" className="nav-link text-light">Tokens</Link>
      <Link to="transactions" className="nav-link text-light">Transactions</Link>
      <Link to="assets"className="nav-link text-light">Assets</Link>
      <Link to="services" className="nav-link text-light">Services</Link>
      <Link to="exams" className="nav-link text-light">Courses</Link>
      <Link to="map" className="nav-link text-light" style={{ float: "right" }}>
        <img src='/src/images/map-map-marker-svgrepo-com.svg' alt='NFT Image' width="36px" />
      </Link>
      {/* <Link to="checkout" className="nav-link text-light" style={{ float: "right" }}>
        <img src='/src/images/shopping-cart-svgrepo-com (5).svg' alt='NFT Image' width="36px" />
      </Link> */}
    </div>
  </nav>
  );
}

// export default  function MarketplaceNav(){
//   return (<nav className="navbar marketplace-nav">
//     <div className="container-fluid">
//       <Link to="/Marketplace" className="nav-link">
//         <Image src="/src/images/color-lineal-marketplace-svgrepo-com.svg" width={"36px"} alt="logo" />
//       </Link>
//       <Link to="/Marketplace/Tokens" className="nav-link text-light">Tokens</Link>
//       <Link to="/Marketplace/Exams" className="nav-link text-light">Exams</Link>
//       <Link to="/Marketplace/Services" className="nav-link text-light">Services</Link>
//       <Link to="/Marketplace/Assets" className="nav-link text-light">Assets</Link>
//       <Link to="/Marketplace/Checkout" className="nav-link text-light" style={{ float: "right" }}>
//         <img src='/src/images/shopping-cart-svgrepo-com (5).svg' alt='NFT Image' width="36px" />
//       </Link>
//     </div>
//   </nav>
//   );
// }
