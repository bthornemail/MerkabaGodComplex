// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Exam {
    struct ExamData {
        address payable creator;
        uint256 price;
        string metadataURI;
        bool isSealed;
    }

    ExamData[] public exams;

    event ExamCreated(uint256 indexed examId, address indexed creator, uint256 price, string metadataURI);

    function createExam(uint256 _price, string memory _metadataURI) public {
        uint256 examId = exams.length;
        exams.push(ExamData(payable(msg.sender), _price, _metadataURI, false));
        emit ExamCreated(examId, msg.sender, _price, _metadataURI);
    }

    function sealExam(uint256 _examId) public {
        ExamData storage exam = exams[_examId];
        require(msg.sender == exam.creator, "Only the creator can seal the exam");
        require(!exam.isSealed, "Exam is already sealed");
        exam.isSealed = true;
    }

    function purchaseExam(uint256 _examId) public payable {
        ExamData storage exam = exams[_examId];
        require(exam.isSealed, "Exam must be sealed to be purchased");
        require(msg.value == exam.price, "Incorrect payment amount");

        exam.creator.transfer(msg.value);
    }
}
