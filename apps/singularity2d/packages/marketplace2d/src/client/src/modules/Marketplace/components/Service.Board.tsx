import { useEffect } from "react";
import { Link } from 'react-router-dom';
import PostServiceForm from "./forms/Post.Service.Form";
import ViewServicesList from "./View.Services.List";
import serviceBoardData from '../../../datasets/service.board.json'
export default function ServiceBoard() {
  useEffect(() => {
    (async () => {
      console.log(serviceBoardData)
    })()
  }, [])
  return (
    <div style={{width: "100%"}}>
      <Link to="" className="text-light" style={{textDecoration:"none",borderBottom:"1px solid white", width:"100%",textAlign:"center"}}><h3>Service Manager</h3></Link>
      <hr />
      <div style={{width: "80%",margin:"auto"}}>
        <PostServiceForm />
      </div>
      <ViewServicesList />
    </div>
  );
}
