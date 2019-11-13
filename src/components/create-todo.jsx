import React, { Component } from "react";
import axios from "axios";

export default class CreateTodo extends Component {
  constructor(props) {
    super(props);

    this.onChangeTodoDescription = this.onChangeTodoDescription.bind(this);
    this.onChangeTodoResponsible = this.onChangeTodoResponsible.bind(this);
    this.onChangeTodoPriority = this.onChangeTodoPriority.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
        todo_description: "",
        todo_responsible: "",
        todo_priority: "",
        todo_completed: false
    }
  }

  onChangeTodoDescription(event) {
    this.setState({
        todo_description: event.target.value
    });
  }

  onChangeTodoResponsible(event) {
    this.setState({
        todo_responsible: event.target.value
    });
  }

  onChangeTodoPriority(event) {
    this.setState({
        todo_priority: event.target.value
    });
  }

  onSubmit(event) {
    event.preventDefault();

    console.log(`Form submitted:`);
    console.log(`Todo Description: ${this.state.todo_description}`);
    console.log(`Todo Responsible: ${this.state.todo_responsible}`);
    console.log(`Todo Priority: ${this.state.todo_priority}`);

    const newTodo = {
      todo_description: this.state.todo_description,
      todo_responsible: this.state.todo_responsible,
      todo_priority: this.state.todo_priority,
      todo_completed: this.state.todo_completed
        };

    axios.post("/todos/add", newTodo)
        .then(res => console.log(res.data));

    this.setState({
        todo_description: '',
        todo_responsible: '',
        todo_priority: '',
        todo_completed: false
    })

    this.props.history.push('/');
  }

   render() {
    return (
      <div className="container py-5 col-6 offset-3 page-animation">
        <div style={{marginTop: 50}}>
          <h3>Create New Todo</h3>
            <form onSubmit={this.onSubmit}>
              <div className="form-group">
                <label>Description: </label>
                  <input  type="text"
                          className="form-control"
                          value={this.state.todo_description}
                          onChange={this.onChangeTodoDescription}
                          />
              </div>
              <div className="form-group">
                <label>Responsible: </label>
                  <input type="text"
                         className="form-control"
                         value={this.state.todo_responsible}
                         onChange={this.onChangeTodoResponsible}
                         />
              </div>
              <div className="form-group">
                <div className="form-check form-check-inline">
                <label>
                  <input  className="form-check-input"
                          type="radio"
                          name="priorityOptions"
                          id="priorityLow"
                          value="Low"
                          checked={this.state.todo_priority==='Low'}
                          onChange={this.onChangeTodoPriority}
                          /><span>Low</span>
                  </label>
                </div>
                <div className="form-check form-check-inline">
                <label>
                  <input  className="form-check-input"
                          type="radio"
                          name="priorityOptions"
                          id="priorityMedium"
                          value="Medium"
                          checked={this.state.todo_priority==='Medium'}
                          onChange={this.onChangeTodoPriority}
                          /><span>Medium</span>
                </label>
                </div>
                <div className="form-check form-check-inline">
                <label>
                  <input  className="form-check-input"
                          type="radio"
                          name="priorityOptions"
                          id="priorityHigh"
                          value="High"
                          checked={this.state.todo_priority==='High'}
                          onChange={this.onChangeTodoPriority}
                          /><span>High</span>
                </label>
                </div>
                </div>

                <div className="form-group">
                  <input type="submit" value="Create Todo" className="btn btn-primary" />
                </div>
            </form>
        </div>
      </div>
    )
}
}

