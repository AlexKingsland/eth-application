pragma solidity >=0.5.0;

contract TodoList{
	uint public taskCount = 0;

	struct Task{
		uint id;
		string text;
		bool completed;
	}

	mapping(uint => Task) public tasks;

	constructor() public{
		createTask("Default task on blockchain");
	}

	function createTask(string memory _text) public{
		taskCount += 1;
		tasks[taskCount] = Task(taskCount, _text, false);
	}
}