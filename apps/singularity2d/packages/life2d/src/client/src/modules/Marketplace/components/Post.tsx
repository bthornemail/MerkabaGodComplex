import { Link, Outlet } from "react-router-dom";
// import { Image } from "react-bootstrap";
export default function Post() {
  return (<div style={{ width: "100%" }}>
    {/* <nav className="navbar marketplace-nav">
      <Link to="/Marketplace" className="nav-link">
        <Image src="/src/images/color-lineal-marketplace-svgrepo-com.svg" width={"36px"} alt="logo" />
      </Link>
      <Link to="/Marketplace/Listings/Post/Exam" className="nav-link text-light">Post Exam</Link>
      <Link to="/Marketplace/Listings/Post/Service" className="nav-link text-light">Post Service</Link>
      <Link to="/Marketplace/Listings/Post/Asset" className="nav-link text-light">Post Asset</Link>
      <Link to="/Marketplace/Checkout" className="nav-link text-light" style={{ float: "right" }}>
        <img src='/src/images/shopping-cart-svgrepo-com (5).svg' alt='NFT Image' width="36px" />
      </Link>
    </nav> */}
    <div>
      <Outlet />
    </div>
  </div>
  )
}