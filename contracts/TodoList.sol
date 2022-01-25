pragma solidity >=0.5.0;

contract TodoList{
	uint public taskCount = 0;

	struct Task{
		uint id;
		string text;
		bool completed;
	}

	mapping(uint => Task) public tasks;

	event TaskCreated(
		uint id,
		string text,
		bool completed
	);

	event TaskCompleted(
		uint id,
		bool completed
	);

	constructor() public{
		createTask("Default task on blockchain");
	}

	function createTask(string memory _text) public{
		taskCount += 1;
		tasks[taskCount] = Task(taskCount, _text, false);
		emit TaskCreated(taskCount, _text, false);
	}

	function toggleCompleted(uint _id) public{
		Task memory _task = tasks[_id];
		_task.completed = !_task.completed;
		tasks[_id] = _task;
		emit TaskCompleted(_id, _task.completed);
	}
}