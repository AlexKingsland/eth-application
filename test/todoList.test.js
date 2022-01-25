const { assert } = require("chai")

const TodoList = artifacts.require('./TodoList.sol')

contract('TodoList', (accounts) => {
  before(async () => {
    this.todoList = await TodoList.deployed()
  })

  it('deploys successfully', async () => {
    const address = await this.todoList.address
    assert(address)
  })

  it('lists tests', async () =>{
    const numTasks = await this.todoList.taskCount()
    const task = await this.todoList.tasks(numTasks)
    assert.equal(numTasks.toNumber(), task.id.toNumber())
  })

  it('creates task', async () => {
    const result = await this.todoList.createTask('new task')
    const numTasks = await this.todoList.taskCount()
    assert.equal(numTasks.toNumber(), 2)
    // Note: result contains the metadata of execution (trans id, address, and also events it triggered)
    const event = result.logs[0].args
    assert.equal(event.id.toNumber(), 2)
    assert.equal(event.text, "new task")
    assert.equal(event.completed, false)
  })

  it('toggles task completion', async () => {
    const task = await this.todoList.tasks(1)
    assert.equal(task.completed, false)
    const result = await this.todoList.toggleCompleted(1)
    const refresh_task = await this.todoList.tasks(1)
    assert.equal(refresh_task.completed, true)
    const event = result.logs[0].args
    assert.equal(event.id.toNumber(), 1)
    assert.equal(event.completed, true)
  })
})