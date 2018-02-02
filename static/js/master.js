var log = console.log.bind(console)

var e = selector => document.querySelector(selector)

var ajax = function(method, path, data, responseCallback) {
	var r = new XMLHttpRequest()
	r.open(method, path, true)
	r.setRequestHeader('Content-Type', 'application/json')
	r.onreadystatechange = function() {
		if (r.readyState == 4) {
			responseCallback(r.response)
		}
	}
	data = JSON.stringify(data)
	r.send(data)
}

var templateTodo = (todo) => {
	var task = todo.task
	var id = todo.id
	var done = todo.done
	if (done) {
		var completed = 'completed'
	} else {
		var completed = ''
	}

	// var t = `
	//     <div class="todo-cell" data-id="${id}">
	//         <button class="todo-done">完成</button>
	//         <button class="todo-delete">删除</button>
	//         <span class="todo-task ${completed}">${task}</span>
	//     </div>
	// `
	var t = `
		<div class="sep5"></div>
		<div class="todo-cell animated fadeInLeft" data-id="${id}">
			<span class="todo-task ${completed}">${task}</span>
			<div class="btn-group"role="group" aria-label="...">
				<button type="button" class="btn btn-info todo-done">完成</button>
				<button type="button" class="btn btn-info todo-delete">删除</button>

			</div>
		</div>
	`
	return t
}

var insertTodo = (todo) => {
	var container = e('#id-div-todo-containers')
	var html = templateTodo(todo)
	container.insertAdjacentHTML('beforeend', html)
}

var insertTodos = (todos) => {
	for (var i = 0; i < todos.length; i++) {
		var todo = todos[i]
		log('todo', todo)
		insertTodo(todo)
	}
}


var loadTodos = () => {
	apiTodoAll(function(todos) {
		log('载入所有 todos', todos)
		insertTodos(todos)
	})
}

var apiTodoAll = callback => {
	var method = 'GET'
	var path = '/todo/all'
	var data = {}
	ajax(method, path, data, function(r) {
		var response = JSON.parse(r)
		callback(response)
	})
}

var apiTodoAdd = (task, callback) => {
	var method = 'POST'
	var path = '/todo/add'
	var data = {
		task: task,
		done: false,
	}
	ajax(method, path, data, function(r) {
		var response = JSON.parse(r)
		callback(response)
	})
}

var apiTodoDelete = (id, callback) => {
	var method = 'GET'
	var path = '/todo/delete/' + id
	var data = {}
	ajax(method, path, data, function(r) {
		var response = JSON.parse(r)
		callback(response)
	})
}

var apiTodoDone = (id, callback) => {
	var method = 'GET'
	var path = '/todo/done/' + id
	var data = {}
	ajax(method, path, data, function(r) {
		var response = JSON.parse(r)
		callback(response)
	})
}

var bindEventAdd = () => {
	var container = e('#id-div-todo-container')
	container.addEventListener('click', function (event) {
		var self = event.target
		if (self.classList.contains('todo-add')) {
			var input = e("#id-input-task")
			var task = input.value
			apiTodoAdd(task, function(data) {
				log('add todo', data)
				input.value = ''
				insertTodo(data)
			})
		}
	})
}

var bindEventDelete = () => {
	var container = e('#id-div-todo-containers')
	container.addEventListener('click', function (event) {
		var self = event.target
		if (self.classList.contains('todo-delete')) {
			var todoCell = self.closest(".todo-cell")
			var id = todoCell.dataset.id
			apiTodoDelete(id, function(data) {
				log('delete', id)
				todoCell.remove()
			})
		}
	})
}

var bindEventDone = () => {
	var container = e('#id-div-todo-containers')
	container.addEventListener('click', function (event) {
		var self = event.target
		if (self.classList.contains('todo-done')) {
			var todoCell = self.closest(".todo-cell")
			var task = todoCell.querySelector(".todo-task")
			var id = todoCell.dataset.id
			apiTodoDone(id, function(data) {
				log('done todo', data)
				task.classList.toggle('completed')
			})
		}
	})
}

var __main = () => {
	bindEventDone()
	bindEventAdd()
	bindEventDelete()
	loadTodos()
}

__main()
