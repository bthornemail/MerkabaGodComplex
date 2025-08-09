// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract CourseNFT is ERC721 {
    // Structs to represent Test, Task, Exam, and Course
    struct Test {
        address creator;
        bool verified;
        string ipfsHash;
        mapping(uint256 => string) correctAnswers;
    }

    struct Task {
        address creator;
        bool verified;
        string ipfsHash;
        uint256 score;
    }

    struct Exam {
        address creator;
        bool verified;
        uint256[] testIds;
        uint256[] taskIds;
    }

    struct Course {
        string courseName;
        string description;
        string resourceLink;
        uint256[] examIds;
    }

    // Mappings to store Test, Task, Exam, and Course against their IDs
    mapping(uint256 => Test) private tests;
    mapping(uint256 => Task) private tasks;
    mapping(uint256 => Exam) private exams;
    mapping(uint256 => Course) private courses;

    // Counters for IDs
    uint256 private nextCourseId = 1;
    uint256 private nextTestId = 1;
    uint256 private nextTaskId = 1;
    uint256 private nextExamId = 1;

    // Events
    event CourseCreated(uint256 indexed courseId, address indexed creator, string courseName);
    event TestCreated(uint256 indexed testId, uint256 indexed courseId, address indexed creator);
    event TestVerified(uint256 indexed testId, address indexed verifier);
    event TaskCreated(uint256 indexed taskId, uint256 indexed courseId, address indexed creator);
    event TaskVerified(uint256 indexed taskId, address indexed verifier);
    event ExamCreated(uint256 indexed examId, uint256 indexed courseId, address indexed creator);
    event ExamVerified(uint256 indexed examId, address indexed verifier);

    constructor() ERC721("CourseNFT", "CNFT") {}

    // Function to create a new course
    function createCourse(string memory _courseName, string memory _description, string memory _resourceLink) external {
        uint256 courseId = nextCourseId++;
        _safeMint(msg.sender, courseId);
        courses[courseId] = Course(_courseName, _description, _resourceLink, new uint256[](0));
        emit CourseCreated(courseId, msg.sender, _courseName);
    }

    // Function to create a new test
    function createTest(uint256 _courseId, string memory _ipfsHash, string[] memory _correctAnswers) external {
        uint256 testId = nextTestId++;
        tests[testId] = Test(msg.sender, false, _ipfsHash);
        for (uint256 i = 0; i < _correctAnswers.length; i++) {
            tests[testId].correctAnswers[i] = _correctAnswers[i];
        }
        courses[_courseId].testIds.push(testId);
        emit TestCreated(testId, _courseId, msg.sender);
    }

    // Function to verify a test
    function verifyTest(uint256 _testId) external {
        tests[_testId].verified = true;
        emit TestVerified(_testId, msg.sender);
    }

    // Function to create a new task
    function createTask(uint256 _courseId, string memory _ipfsHash) external {
        uint256 taskId = nextTaskId++;
        tasks[taskId] = Task(msg.sender, false, _ipfsHash, 0);
        courses[_courseId].taskIds.push(taskId);
        emit TaskCreated(taskId, _courseId, msg.sender);
    }

    // Function to verify a task and assign a score
    function verifyTask(uint256 _taskId, uint256 _score) external {
        tasks[_taskId].verified = true;
        tasks[_taskId].score = _score;
        emit TaskVerified(_taskId, msg.sender);
    }

    // Function to create a new exam
    function createExam(uint256 _courseId) external {
        uint256 examId = nextExamId++;
        exams[examId] = Exam(msg.sender, false, new uint256[](0), new uint256[](0));
        courses[_courseId].examIds.push(examId);
        emit ExamCreated(examId, _courseId, msg.sender);
    }

    // Function to verify an exam
    function verifyExam(uint256 _examId) external {
        exams[_examId].verified = true;
        emit ExamVerified(_examId, msg.sender);
    }

    // Getter functions to fetch details
    function getCourseDetails(uint256 _courseId) external view returns (string memory, string memory, string memory) {
        Course storage course = courses[_courseId];
        return (course.courseName, course.description, course.resourceLink);
    }

    function getTestDetails(uint256 _testId) external view returns (address, bool, string memory, string[] memory) {
        Test storage test = tests[_testId];
        string[] memory correctAnswers = new string[](getTestQuestionCount(_testId));
        for (uint256 i = 0; i < getTestQuestionCount(_testId); i++) {
            correctAnswers[i] = test.correctAnswers[i];
        }
        return (test.creator, test.verified, test.ipfsHash, correctAnswers);
    }

    function getTaskDetails(uint256 _taskId) external view returns (address, bool, string memory, uint256) {
        Task storage task = tasks[_taskId];
        return (task.creator, task.verified, task.ipfsHash, task.score);
    }

    function getExamDetails(uint256 _examId) external view returns (address, bool, uint256[] memory, uint256[] memory) {
        Exam storage exam = exams[_examId];
        return (exam.creator, exam.verified, exam.testIds, exam.taskIds);
    }

    // Helper function to get the question count for a test
    function getTestQuestionCount(uint256 _testId) public view returns (uint256) {
        return tests[_testId].correctAnswers.length;
    }
}
