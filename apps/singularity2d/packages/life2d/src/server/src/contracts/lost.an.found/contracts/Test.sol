// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Test {
    struct TestData {
        uint8 questionType;
        string ipfsHash;
        string answerHash;
        uint256 weight;
        bool isSubmitted;
        bool isImmutable;
        uint256 maxScore;
        uint256 price;
        address creator;
    }

    TestData[] public tests;

    event TestCreated(
        uint256 indexed testId,
        uint8 questionType,
        string ipfsHash,
        string answerHash,
        uint256 weight
    );

    function createTest(
        uint8 _questionType,
        string memory _ipfsHash,
        string memory _answerHash,
        uint256 _weight,
        uint256 _maxScore,
        uint256 _price
    ) public {
        uint256 id = tests.length;
        tests.push(
            TestData(
                _questionType,
                _ipfsHash,
                _answerHash,
                _weight,
                false,
                false,
                _maxScore,
                _price,
                msg.sender
            )
        );
        emit TestCreated(id, _questionType, _ipfsHash, _answerHash, _weight);
    }

    function submitTest(uint256 _testId) public {
        require(_testId < tests.length, "Invalid test ID");
        TestData storage test = tests[_testId];
        test.isSubmitted = true;
    }

    function makeImmutable(uint256 _testId) public {
        require(_testId < tests.length, "Invalid test ID");
        TestData storage test = tests[_testId];
        test.isImmutable = true;
    }

    function isSubmitted(uint256 _testId) public view returns (bool) {
        require(_testId < tests.length, "Invalid test ID");
        return tests[_testId].isSubmitted;
    }

    function isImmutable(uint256 _testId) public view returns (bool) {
        require(_testId < tests.length, "Invalid test ID");
        return tests[_testId].isImmutable;
    }

    function getMaxScore(uint256 _testId) public view returns (uint256) {
        require(_testId < tests.length, "Invalid test ID");
        return tests[_testId].maxScore;
    }

    function getTestId(Test _test) public pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(address(_test))));
    }

    function getCreator(uint256 _testId) public view returns (address) {
        require(_testId < tests.length, "Invalid test ID");
        return tests[_testId].creator;
    }

    function getTestPrice(uint256 _testId) public view returns (uint256) {
        require(_testId < tests.length, "Invalid test ID");
        return tests[_testId].price;
    }
}
