import { Accordion, Offcanvas } from 'react-bootstrap';
import Peer from "../Peer";
export default function NodeSideBar({ handleClose, show, activeKey,placement }) {
    return (<Offcanvas  placement={placement} show={show} onHide={handleClose} style={{ backgroundColor: "rgba(0,0,0,.80)" }}>
        <Offcanvas.Header closeButton>
            <Offcanvas.Title>Protocol Service Manager<br /><sub>Remote Procedure Calls</sub></Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body >
            <Accordion defaultActiveKey={activeKey} >
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Peer Manager</Accordion.Header>
                    <Accordion.Body>
                        <Peer />
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>Filter</Accordion.Header>
                    <Accordion.Body>
                        {/* <Filter /> */}
                        {"<Filter />"}
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </Offcanvas.Body>
    </Offcanvas>)
}