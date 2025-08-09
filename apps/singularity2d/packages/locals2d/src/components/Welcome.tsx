import { useNavigate } from "react-router-dom";
import Portfolio from "./ui/Portfolio";
import Jumbotron from "./ui/Jumbotron";
import Thumbnails from "./ui/Thumbnails";
import logo from '../assets/upload-svgrepo-com.svg'
export default function Welcome() {
   const navigate = useNavigate();
    function handleClick() {
        navigate("interface")
    }
    return (<div className='graph-container'>
        <div>
            <p className="p-3">
                I'm here to
                <input type="text" className="form-control form-control" placeholder="Describe what you are looking for.." />
                <br />
                In the area of
                <input type="address" className="b form-control form-control" placeholder="Zipcode" />
            </p>
        </div>
        <div className="btn-group">
            <button className={`btn btn-outline-light rounded-3  me-2`} type="button" onClick={handleClick}>Search</button>
        </div>
        <Portfolio rows={4} cols={4} query="all categories" />
        <Portfolio rows={1} cols={4} query="featured ads" />
        <Portfolio rows={2} cols={3} query="popular locations" />
        <Jumbotron input={()=>{throw new Error("")}} action={()=>{throw new Error("")}} reaction={()=>{throw new Error("")}} />
        <Portfolio rows={1} cols={2} query="Latest Ads" isScrollable={true} />
        <Jumbotron input={()=>{throw new Error("")}} action={()=>{throw new Error("")}} reaction={()=>{throw new Error("")}} />
        <Thumbnails logo={logo}/>
        <Portfolio rows={1} cols={4} query="Our pricing"/>
        <Portfolio rows={1} cols={3} query="Latest Blog"/>
        <Jumbotron input={()=>{throw new Error("")}} action={()=>{throw new Error("")}} reaction={()=>{throw new Error("")}} />
        <section className="footer">
        Footer
        </section>
    </div>

    );
}
