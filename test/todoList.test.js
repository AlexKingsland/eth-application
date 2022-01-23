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
})