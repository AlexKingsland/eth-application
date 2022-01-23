App = {
	contracts: {},
	loading: false,

	load: async() => {
		await App.loadWeb3()
		await App.loadAccount()
		await App.loadContract()
		await App.render()
	},

	loadWeb3: async () => {
		console.log("TEST LOAD WEB3")
		// Modern dapp browsers...
		if (window.ethereum) {
			console.log("Modern dapp browser found")
			App.web3Provider = window.ethereum;
			try {
			  // Request account access
			  await ethereum.request({ method: 'eth_requestAccounts' })
			} catch (error) {
			  // User denied account access...
			  console.error("User denied account access")
			}
			console.log("successfully connected to browser")
		  }
		  // Legacy dapp browsers...
		  else if (window.web3) {
			App.web3Provider = window.web3.currentProvider;
		  }
		  // If no injected web3 instance is detected, fall back to test network on local host
		  else {
			App.web3Provider = None//new Web3.providers.HttpProvider('http://localhost:7545');
		  }
		  web3 = new Web3(App.web3Provider);
	  },

	  loadAccount: async () => {
		console.log("LOADING TEST ACCOUNT")
		existing_accounts_on_node = await web3.eth.getAccounts();
		App.account = existing_accounts_on_node[0]
		console.log(App.account)
		console.log("LOADED TEST ACCOUNT")
	  },

	  loadContract: async () => {
		  todolistContract = await $.getJSON("TodoList.json") // Can access this because we give access to src in bs-config
		  console.log(todolistContract)
		  // JS version of smart contract so contract can be interacted with and methods of contract can be called in JS
		  App.contracts.todolistContract = TruffleContract(todolistContract)
		  App.contracts.todolistContract.setProvider(App.web3Provider)

		  App.todolistContract = await App.contracts.todolistContract.deployed()
	  },

	  render: async () => {
		  if (App.loading){
			  return;
		  }

		  App.setLoading(true);
		  // Render account id in top corner (span[@id='account']) in index.html
		  $("#account").html(App.account);

		  await App.renderTasks();

		  App.setLoading(false);
	  },

	  renderTasks: async () => {
		// Load the total task count from the blockchain
		const taskCount = await App.todolistContract.taskCount()
		const $taskTemplate = $('.taskTemplate') // fetch template from html index file

		// Render out each task with a new task template
		for (var i = 1; i <= taskCount; i++) {
			// Fetch the task data from the blockchain
			const task = await App.todolistContract.tasks(i)
			const taskId = task[0].toNumber()
			const taskText = task[1]
			const taskCompleted = task[2]
	  
			// Create the html for the task
			const $newTaskTemplate = $taskTemplate.clone()
			$newTaskTemplate.find('.text').html(taskText)
			$newTaskTemplate.find('input')
							.prop('name', taskId)
							.prop('checked', taskCompleted)
							.on('click', App.toggleCompleted)
	  
			// Put the task in the correct list
			if (taskCompleted) {
			  $('#completedTaskList').append($newTaskTemplate)
			} else {
			  $('#taskList').append($newTaskTemplate)
			}
	  
			// Show the task
			$newTaskTemplate.show()
		  }
	  },

	  setLoading: (boolean) => {
		App.loading = boolean
		const loader = $('#loader')
		const content = $('#content')
		if (boolean) {
		  loader.show()
		  content.hide()
		} else {
		  loader.hide()
		  content.show()
		}
	  }
	
}

$(() => {
	$(window).load(() => {
		App.load()
	})
})