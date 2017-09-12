// express_demo.js 文件
var fs = require('fs')

// 引入 express 并且创建一个 express 实例赋值给 app
var express = require('express')
var bodyParser = require('body-parser')
var app = express()

var log = console.log.bind(console, '**** log: ')

var todoList = []

app.use(express.static('static'))
app.use(bodyParser.json())

const sendHtml = (path, response) => {
    var fs = require('fs')
    var options = {
        encoding: 'utf-8'
    }
    path = 'template/' + path
    fs.readFile(path, options, (error, data) => {
        response.send(data)
    })
}

app.get('/', (request, response) => {
    const path = 'template/index.html'
    const options = {
        encoding: 'utf-8',
    }
    fs.readFile(path, options, (error, data) => {
        log('data type', typeof data)
        response.send(data)
    })
})

var sendJSON = (response, data) => {
    var r = JSON.stringify(data, null, 2)
    response.send(r)
}

app.get('/todo/all', (requrest, response) => {
    sendJSON(response, todoList)
})

var todoAdd = (form) => {
    if (todoList.length == 0) {
        form.id = 1
    } else {
        var lastTodo = todoList[todoList.length - 1]
        form.id = lastTodo.id + 1
    }
    todoList.push(form)
    return form
}

var todoDelete = (id) => {
    id = Number(id)
    var index = -1
    for (var i = 0; i < todoList.length; i++) {
        var t = todoList[i]
        if (t.id == id) {
            index = i
            break
        }
    }
    // 判断 index 来查看是否找到了相应的数据
    if (index > -1) {
        var t = todoList.splice(index, 1)[0]
        log('splice todo', t)
        return t
    } else {
        return {}
    }
}


var todoDone = (id) => {
    id = Number(id)
    var index = -1
    for (var i = 0; i < todoList.length; i++) {
        var t = todoList[i]
        if (t.id == id) {
            // 找到了
            index = i
            break
        }
    }
    // 判断 index 来查看是否找到了相应的数据
    if (index > -1) {
        // 找到了, 用 splice 函数删除
        // splice 函数返回的是包含被删除元素的数组
        // 所以要用 [0] 取出数据
        var t = todoList[index]
        t.done = !t.done
        log('done todo', t)
        return t
    } else {
        // 没找到
        return {}
    }
}

app.post('/todo/add', (request, response) => {
    var form = request.body
    var todo = todoAdd(form)
    sendJSON(response, todo)
})

app.get('/todo/delete/:id', (request, response) => {
    var id = request.params.id
    log('delete 路由', id, typeof id, todoList)
    var todo = todoDelete(id)
    log('todo', todo)
    sendJSON(response, todo)
})

app.get('/todo/done/:id', (request, response) => {
    var id = request.params.id
    var todo = todoDone(id)
    sendJSON(response, todo)
})

var server = app.listen(8000, (...args) => {
    console.log('server', args, args.length)
    var host = server.address().address
    var port = server.address().port

    console.log(`应用实例，访问地址为 http://${host}:${port}`)
})
