import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Todo = props => (
  <tr>
      <td className={props.todo.todo_completed ? "completed" : "" }>{props.todo.todo_description}</td>
      <td className={props.todo.todo_completed ? "completed" : "" }>{props.todo.todo_responsible}</td>
      <td className={props.todo.todo_completed ? "completed" : "" }>{props.todo.todo_priority}</td>
      <td><Link to={"/edit/"+props.todo._id}>Edit</Link></td>
      <td><Link to={"/delete/"+props.todo._id}>Delete</Link></td>
  </tr>
)

export default class TodosList extends Component {
  constructor(props) {
    super(props);
    this.state = {todos: []};
    }

  componentDidMount(prevProps) {
    axios.get("http://localhost:4000/todos/")
        .then(response => {
            this.setState({ todos: response.data });
        })
        .catch(function (error){
            console.log(error);
        })
  }


  componentDidUpdate(prevProps) {
  axios.get("http://localhost:4000/todos/")
      .then(response => {
        // if (this.props !== prevProps) {
          this.setState({ todos: response.data });
        // }
      })
      .catch(function (error){
          console.log(error);
      })
  }

  todoList() {
    return this.state.todos.map(function(currentTodo, i){
        return <Todo todo={currentTodo} key={i} />;
    })
  }

  render() {
  return (
    <div className="container hoverable">
      <div id="items-outer-container">
        <table className="highlight" style={{ marginTop: 20 }} >
          <thead>
            <tr>
              <th className="pr-5">Description</th>
              <th className="pr-5">Responsible</th>
              <th className="pr-5">Priority</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            { this.todoList() }
          </tbody>
        </table>
        </div>
    </div>
    )
  }
}

