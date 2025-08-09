import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

const AssetNFT: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [securityDeposit, setSecurityDeposit] = useState(0);
  const [repairCost, setRepairCost] = useState(0);
  const [totalLossCost, setTotalLossCost] = useState(0);
  const [metadataHash, setMetadataHash] = useState('');

  return (
    <div className="AssetNFT-container main-content">
      <h1 className="AssetNFT-title">Asset NFT</h1>
      <Form>
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter asset name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter asset description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="price">
          <Form.Label>Price</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter asset price"
            value={price}
            onChange={(e) => setPrice(parseInt(e.target.value, 10))}
          />
        </Form.Group>
        <Form.Group controlId="securityDeposit">
          <Form.Label>Security Deposit</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter asset security deposit"
            value={securityDeposit}
            onChange={(e) => setSecurityDeposit(parseInt(e.target.value, 10))}
          />
        </Form.Group>
        <Form.Group controlId="repairCost">
          <Form.Label>Repair Cost</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter asset repair cost"
            value={repairCost}
            onChange={(e) => setRepairCost(parseInt(e.target.value, 10))}
          />
        </Form.Group>
        <Form.Group controlId="totalLossCost">
          <Form.Label>Total Loss Cost</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter asset total loss cost"
            value={totalLossCost}
            onChange={(e) => setTotalLossCost(parseInt(e.target.value, 10))}
          />
        </Form.Group>
        <Form.Group controlId="metadataHash">
          <Form.Label>Metadata Hash</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter asset metadata hash"
            value={metadataHash}
            onChange={(e) => setMetadataHash(e.target.value)}
          />
        </Form.Group>
        <Button className="AssetNFT-button" variant="primary" onClick={()=>{}}>
          Create Asset
        </Button>
      </Form>
    </div>
  );
}

export default AssetNFT;

       
