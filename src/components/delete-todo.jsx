import React, { Component } from "react";
import axios from "axios";

export default class DeleteTodo extends Component {

    constructor(props) {
        super(props);
        this.deleteTodo = this.deleteTodo.bind(this);
    }

    deleteTodo() {
        axios.delete("http://localhost:4000/todos/delete/"+this.props.match.params.id)
            .then(res => console.log("Todo successfully deleted!"));

        this.props.history.push("/");
    }

 render() {
  return (
    <div className="py-5 col-6 offset-3 page-animation">
      <h3 align="center">Delete Todo</h3>
        <h5 className="text-center py-5">Are you sure?</h5>

        <div className="form-group text-center">
            <div onClick={this.deleteTodo} className="btn red">Yes</div>
        </div>
      </div>
  )
}
}

