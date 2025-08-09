// components/ExamNFT.tsx
import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
const ExamNFT: React.FC = () => {
  const [ipfsHash, setIpfsHash] = useState('');
  const [questionIds, setQuestionIds] = useState('');
  const [taskIds, setTaskIds] = useState('');
  const [passingGPA, setPassingGPA] = useState(0);
  const [maxGPA, setMaxGPA] = useState(0);
  const [vtcAmount, setVtcAmount] = useState(0);
  const createTest = async () => {

  };
  

  return (
    <div className="main-content">
      <h1>Create Test</h1>
      <Form>
        <Form.Group controlId="ipfsHash">
          <Form.Label>IPFS Hash</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter IPFS hash for test metadata"
            value={ipfsHash}
            onChange={(e) => setIpfsHash(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="questionIds">
          <Form.Label>Question IDs</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter comma-separated question IDs"
            value={questionIds}
            onChange={(e) => setQuestionIds(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="taskIds">
          <Form.Label>Task IDs</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter comma-separated task IDs"
            value={taskIds}
            onChange={(e) => setTaskIds(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="passingGPA">
          <Form.Label>Passing GPA</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter passing GPA"
            value={passingGPA}
            onChange={(e) => setPassingGPA(parseInt(e.target.value, 10))}
          />
        </Form.Group>
        <Form.Group controlId="maxGPA">
          <Form.Label>Max GPA</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter max GPA"
            value={maxGPA}
            onChange={(e) => setMaxGPA(parseInt(e.target.value, 10))}
          />
        </Form.Group>
        <Form.Group controlId="vtcAmount">
          <Form.Label>VTC Amount</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter VTC amount"
            value={vtcAmount}
            onChange={(e) => setVtcAmount(parseInt(e.target.value, 10))}
          />
        </Form.Group>
        <Button variant="primary" onClick={createTest}>
          Create Test
        </Button>
      </Form>
    </div>
  );
};

export default ExamNFT;
