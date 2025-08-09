/* eslint-disable @typescript-eslint/no-explicit-any */
import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
function FolderObjectData({message}){
    return message.map((entry, index) => (
      <Row key={index}>
        <Col>
        <div>{typeof entry === "string" ? entry : JSON.stringify(entry)}</div>
        </Col>
      </Row>
    ))
}
function FolderSummary({topic,message}: {topic:string,message: any[]}){
    return <details>
    <summary>
      {topic}
      {/* <Link to="entities">...</Link> */}
    </summary>
    <FolderObjectData message={message}/>
  </details>
}

export default function Folder ({drawerSize,setDrawerSize}){
    return <div>
        <div>
            <button className="btn btn-outline-primary btn-sm" onClick={()=>{
              switch (drawerSize) {
                case "200px":
                  setDrawerSize("max-content");
                  break;
                case "max-content":
                  setDrawerSize("200px");
                  break;
                default:
                  setDrawerSize("200px");
                  break;
              }
            }}>Open</button>
          </div>
          <FolderSummary topic="entities" message={['user','wallet']}/>
          <FolderSummary topic="identities" message={[['user',{identity:"Brian"}],['wallet',{extendedKey:"0x8767986786786"}]]}/>
    </div>
}