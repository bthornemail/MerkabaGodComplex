import { useState, useEffect } from "react";
import { Card, Table, Spinner } from "react-bootstrap";
const ViewServicesList = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <div className="container mt-5">
      <Card>
        <Card.Header>List of Services</Card.Header>
        <Card.Body>
          {loading ? (
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Service Name</th>
                  <th>Provider</th>
                  <th>URI</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service, i) => (
                  <tr key={service.id}>
                    <td>{i + 1}</td>
                    <td>{service.name}</td>
                    <td>{service.provider}</td>
                    <td>{service.uri}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default ViewServicesList;
