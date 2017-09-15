import React, {Component} from 'react'
import './App.css'
import TodoInput from './TodoInput'
import TodoItem from './TodoItem'
import 'normalize.css'
import './reset.css'
import UserDialog from './UserDialog'
import {getCurrentUser, signOut, TodoModel, load} from './leanCloud'

//import 'jquery'


class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: getCurrentUser() || {},
            newTodo: '',
            todoList:  []
        }

    let user = getCurrentUser()

    if(user) {
        TodoModel.getByUser(user, (todos) => {
            let stateCopy = JSON.parse(JSON.stringify(this.state))
            stateCopy.todoList = todos
            this.setState(stateCopy)
        })
    }
}

render()
{
    let todos = this.state.todoList.filter((item) => !item.deleted).map((item, index) => {
        return (
            <li key={index}>
                <TodoItem todo={item} onToggle={this.toggle.bind(this)}
                          onDelete={this.delete.bind(this)}/>
            </li>
        )
    })
    // console.log(todos)
    return (
        <div className="App">
            <h1>{this.state.user.username || '我'}的待办
                {this.state.user.id ? <button onClick={this.signOut.bind(this)}>登出</button> : null}
            </h1>
            <div className="inputWrapper">
                <TodoInput content={this.state.newTodo}
                           onChange={this.changeTitle.bind(this)}
                           onSubmit={this.addTodo.bind(this)}/>
            </div>
            <ol className="todoList">
                {todos}
            </ol>
            {this.state.user.id ? null :
                <UserDialog
                    onSignUp={this.onSignUpOrSignIn.bind(this)}
                    onSignIn={this.onSignUpOrSignIn.bind(this)}/>}
        </div>
    )
}

signOut()
{
    signOut()
    let stateCopy = JSON.parse(JSON.stringify(this.state))
    stateCopy.user = {}
    this.setState(stateCopy)
}

onSignUpOrSignIn(user)
{
    //不要直接系应该state，用深拷贝
    let stateCopy = JSON.parse(JSON.stringify(this.state))
    stateCopy.user = user
    this.setState(stateCopy)
}

componentDidUpdate()
{
    save('todoList', this.state.todoList)
}

toggle(e, todo)
{
    todo.status = todo.status === 'completed' ? '' : 'completed'
    this.setState(this.state)

}

changeTitle(event)
{
    this.setState({
        newTodo: event.target.value,
        todoList: this.state.todoList
    })

}

addTodo(event)
{
    let newTodo = {
        title: event.target.value,
        status: null,
        deleted: false
    }
    TodoModel.create(newTodo, (id) => {
        newTodo.id = id
        this.state.todoList.push(newTodo)
        this.setState({
            newTodo: '',
            todoList: this.state.todoList
        })
    }, (error) => {
        console.log(error)
    })
    event.target.value = ''
}

delete(event, todo)
{
    todo.deleted = true
    this.setState(this.state)

}
}

export default App;
