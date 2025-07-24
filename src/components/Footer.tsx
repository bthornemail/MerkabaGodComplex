import Controller from "./Controller";
import Post from "./Post";
import Search from "./Search";
export default function Footer() {
    return (<footer className="fixed-bottom p-2" >
        {/* <Controller /> */}
        <div className="mt-4  container" style={{ display: "flex", alignItems: "center", justifyContent: "space-around" }}>
            <div className=" container">
                <Search />
            </div>
            <div className=" container">
                <Post />
            </div>
        </div>
    </footer>)
}