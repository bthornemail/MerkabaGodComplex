import { useContext } from "react"
import Form from "./Form"
import { GraphContext } from "../hooks/hypergraph/useGraph"
import { Container, Row, Col } from "react-bootstrap";
export default function Interface() {
    const graph = useContext(GraphContext);
    return <div>
        <div className="label" style={{ width: "100%", transform: "none" }}>Auth</div>
        <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <Container>
                {/* Stack the columns on mobile by making one full-width and the other half-width */}
                <Row>
                    <Col xs={12} md={8}>
                        xs=12 md=8
                        <section className="card">

                        </section>
                        <textarea className="form-control" defaultValue={"Enter Message"}></textarea>
                        <div className='btn-group'>
                            <button id='signMessageBtn' className='btn btn-secondary'>Sign Message</button>
                            <button id='verifyMessageBtn' className='btn btn-success'>Verify Message</button>
                        </div>

                    </Col>
                    <Col xs={6} md={4}>
                        xs=6 md=4
                        <Form/>
                    </Col>
                </Row>

                {/* Columns start at 50% wide on mobile and bump up to 33.3% wide on desktop */}
                <Row>
                    <Col xs={6} md={4}>
                        xs=6 md=4
                    </Col>
                    <Col xs={6} md={4}>
                        xs=6 md=4
                    </Col>
                    <Col xs={6} md={4}>
                        xs=6 md=4
                    </Col>
                </Row>

                {/* Columns are always 50% wide, on mobile and desktop */}
                <Row>
                    <Col xs={6}>xs=6</Col>
                    <Col xs={6}>xs=6</Col>
                </Row>
            </Container>
        </div>
    </div>
}
