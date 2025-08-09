// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Task {
    struct TaskData {
        string description;
        string ipfsHash;
        uint256 weight;
        uint256 maxScore;
        uint256 price;
        bool isSubmitted;
        bool isImmutable;
        address creator;
        address[] delegates;
    }

    TaskData[] public tasks;

    event TaskCreated(
        uint256 indexed taskId,
        string description,
        string ipfsHash,
        uint256 weight
    );

    function createTask(
        string memory _description,
        string memory _ipfsHash,
        uint256 _weight,
        uint256 _maxScore,
        uint256 _price,
        address[] memory _delegates
    ) public {
        uint256 id = tasks.length;
        tasks.push(
            TaskData(
                _description,
                _ipfsHash,
                _weight,
                _maxScore,
                _price,
                false,
                false,
                msg.sender,
                _delegates
            )
        );
        emit TaskCreated(id, _description, _ipfsHash, _weight);
    }

    function submitTask(uint256 _taskId) public {
        require(_taskId < tasks.length, "Invalid task ID");
        TaskData storage task = tasks[_taskId];
        task.isSubmitted = true;
    }

    function makeImmutable(uint256 _taskId) public {
        require(_taskId < tasks.length, "Invalid task ID");
        TaskData storage task = tasks[_taskId];
        task.isImmutable = true;
    }

    function isSubmitted(uint256 _taskId) public view returns (bool) {
        require(_taskId < tasks.length, "Invalid task ID");
        return tasks[_taskId].isSubmitted;
    }

    function isImmutable(uint256 _taskId) public view returns (bool) {
        require(_taskId < tasks.length, "Invalid task ID");
        return tasks[_taskId].isImmutable;
    }

    function getMaxScore(uint256 _taskId) public view returns (uint256) {
        require(_taskId < tasks.length, "Invalid task ID");
        return tasks[_taskId].maxScore;
    }

    function getTaskId(Task _task) public pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(address(_task))));
    }

    function getCreator(uint256 _taskId) public view returns (address) {
        require(_taskId < tasks.length, "Invalid task ID");
        return tasks[_taskId].creator;
    }

    function getTaskPrice(uint256 _taskId) public view returns (uint256) {
        require(_taskId < tasks.length, "Invalid task ID");
        return tasks[_taskId].price;
    }

    function getDelegates(uint256 _taskId) public view returns (address[] memory) {
        require(_taskId < tasks.length, "Invalid task ID");
        return tasks[_taskId].delegates;
    }
}
