import { Image, Container, Row, Col } from 'react-bootstrap'
export default function Thumbnails({ logo }: any) {
    return <Container>
      <Row>
        <Col >
          <Image src={logo} width={120} roundedCircle />
        </Col>
        <Col >
          <Image src={logo} width={120} roundedCircle />
        </Col>
        <Col >
          <Image src={logo} width={120} roundedCircle />
        </Col>
      </Row>
    </Container>
}