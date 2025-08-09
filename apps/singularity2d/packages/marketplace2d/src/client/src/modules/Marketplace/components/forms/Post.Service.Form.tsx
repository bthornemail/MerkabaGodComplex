// components/ServiceNFT.tsx
import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
const ServiceNFT: React.FC = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState('');
    const [metadata, setMetadata] = useState('');


    return (
        <div className="main-content">
            <h1>Post Service</h1>
            <Form>
                <Form.Group controlId="name">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter service name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="price">
                    <Form.Label>Price</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Enter service price"
                        value={price}
                        onChange={(e) => setPrice(parseInt(e.target.value, 10))}
                    />
                </Form.Group>
                <Form.Group controlId="description">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter service description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="metadata">
                    <Form.Label>Metadata</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter service metadata"
                        value={metadata}
                        onChange={(e) => setMetadata(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" onClick={()=>alert("hello")}>
                    Create Service
                </Button>
            </Form>
        </div>
    );
};

export default ServiceNFT;
