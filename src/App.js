import React, {Component} from 'react'
import './App.css'
import TodoInput from './TodoInput'
import TodoItem from './TodoItem'
import 'normalize.css'
import './reset.css'
import UserDialog from './UserDialog'
import {getCurrentUser, signOut, TodoModel,} from './leanCloud'
import GroupItem from './GroupItem'

//import 'jquery'

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: getCurrentUser() || {},
            newTodo: '',
            todoList: [],
            newGroup: '',
            currentGroup: '',
            groups: [],
            time: '',
        }

        let user = getCurrentUser()

        if (user) {
            TodoModel.getByUser(user, (todos) => {
                let stateCopy = JSON.parse(JSON.stringify(this.state))
                stateCopy.todoList = todos
                todos.filter((item) => (!item.deleted)).map((item) => {
                    if (stateCopy.groups.indexOf(item.group) === -1) {//同步数据库中有的group
                        stateCopy.groups.unshift(item.group)
                    }
                    return item
                })
                if (stateCopy.groups.length)
                    stateCopy.currentGroup = stateCopy.groups[0]
                this.setState(stateCopy)
            })
        }
     let _this = this
        setInterval(function () {
            let newTime = new Date()
            let year = newTime.getFullYear();
            let month = newTime.getMonth() + 1;
            let date = newTime.getDate();
            let day = newTime.getDay();
            _this.setState({time:  `${year}年 ${month}月 ${date}日 星期${day} `})
        },30)
    }

    render() {
        let todos = this.state.todoList.filter((item) => !item.deleted)
            .filter((item) => item.group === this.state.currentGroup)
            .map((item, index) => {
                return (
                    <li key={index}>
                        <TodoItem todo={item} onToggle={this.toggle.bind(this)}
                                  onDelete={this.delete.bind(this)}/>
                    </li>
                )
            })

        let groups = this.state.groups.map((item, index) => {
            return (
                <li key={index}>
                    <GroupItem title={item} seleted={item === this.state.currentGroup}
                               onDelete={this.deleteGroup.bind(this)}/>
                </li>
            )
        })

        return (
            <div className="App">
                <aside>
                    <div className="head">
                        <h1>{this.state.user.username || '我'}的事件簿</h1>
                        {this.state.user.id ? <a onClick={this.signOut.bind(this)}>登出</a> : null}
                    </div>
                    <div className="groups-box">
                        <div className="input-group-wrapper">
                            <TodoInput content={this.state.newGroup}
                                       onChange={this.changeGroupTitle.bind(this)}
                                       onSubmit={this.addGroup.bind(this)}
                                       placeholder='新建事件簿'/>
                        </div>
                        <div className="groups-wrap">
                            <ol className="groups" onClick={this.selectGroup.bind(this)}>
                                {groups}
                            </ol>
                        </div>
                    </div>
                </aside>
                <main>
                    <div className="title">
                        <p>一年之计在于春，一天之计在于晨。{this.state.time}</p>
                    </div>
                        <div className="inputWrapper">
                            <TodoInput content={this.state.newTodo}
                                       onChange={this.changeTitle.bind(this)}
                                       onSubmit={this.addTodo.bind(this)}
                                       placeholder='请输入todo'/>
                        </div>
                        <ol className="todoList">
                            {todos}
                        </ol>
                </main>
                {this.state.user.id ? null :
                    <UserDialog
                        onSignUp={this.onSignUpOrSignIn.bind(this)}
                        onSignIn={this.onSignUpOrSignIn.bind(this)}/>}
            </div>
        )
    }

    signOut() {
        signOut()
        window.location.reload()
        let stateCopy = JSON.parse(JSON.stringify(this.state))
        stateCopy.user = {}
        this.setState(stateCopy)
    }

    onSignUpOrSignIn(user) {
        //不要直接系应该state，用深拷贝
        let stateCopy = JSON.parse(JSON.stringify(this.state))
        stateCopy.user = user
        this.setState(stateCopy)
    }

    componentDidUpdate() {
    }

    toggle(e, todo) {
        let oldStatus = todo.status
        todo.status = todo.status === 'completed' ? '' : 'completed'
        TodoModel.update(todo, () => {
            this.setState(this.state)
        }, (error) => {
            todo.status = oldStatus
            this.setState(this.state)
        })
    }

    changeTitle(event) {
        this.setState({
            newTodo: event.target.value,
            todoList: this.state.todoList
        })

    }

    addTodo(event) {
        if(this.state.groups.length === 0){
            alert('请新建事件簿后再写入事项')
            return
        }
        let newTodo = {
            title: event.target.value,
            status: '',
            deleted: false,
            group: this.state.currentGroup,
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

    delete(event, todo) {
        TodoModel.destroy(todo.id, () => {
            todo.deleted = true
            this.setState(this.state)
        })
    }

    addGroup(event) {
        let len = this.state.groups.length
        let value = event.target.value.trim()//trim会去掉两端的空白字符
        if (this.state.groups.indexOf(value) !== -1) {
            alert('该事件簿已存在，请另取名称')
            this.setState({
                currentGroup: value,
                newGroup: '',
            })
        } else {
            this.state.groups.unshift(value)
            this.setState({
                groups: this.state.groups,
                currentGroup: value,
                newGroup: '',
            })
        }
    }

    changeGroupTitle(event) {
        this.setState({
            newGroup: event.target.value,
        })
    }

    deleteGroup(e, group) {
        if (this.state.groups.length === 1) {
            alert('请至少保留一个事件簿')
            return
        }
        let confirm = window.confirm('删除事件簿将删除内部的所有事件')
        if (confirm) {
            let node = e.target.previousSibling
            if (node.classList.contains('group-title')) {
                let stateCopy = JSON.parse(JSON.stringify(this.state))
                let index = stateCopy.groups.indexOf(node.innerText)
                stateCopy.groups.splice(index, 1)
                stateCopy.todoList.map((item) => {
                    if (item.group === node.innerText) {
                        TodoModel.destroy(item.id, () => {
                            item.deleted = true
                        })
                    }
                    return item
                })
                stateCopy.currentGroup = stateCopy.groups[0]
                this.setState(stateCopy)
            }
        }
    }

    selectGroup(e) {
        if (e.target.classList.contains('group-title')) {
            this.setState({
                currentGroup: e.target.innerText,
            })
        }
    }


}

export default App;
