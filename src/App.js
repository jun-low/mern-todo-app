import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";
import { Provider } from "react-redux";
import store from "./store";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import CreateTodo from "./components/create-todo";
import EditTodo from "./components/edit-todo";
import DeleteTodo from "./components/delete-todo";
import TodosList from "./components/todo-list";
import Login from "./components/login-user";
import Register from "./components/register-user";
import PrivateRoute from "./components/private-route/PrivateRoute";

// Check for token to keep user logged in
if (localStorage.jwtToken) {
  const token = localStorage.jwtToken;
  setAuthToken(token);

  const decoded = jwt_decode(token);
  store.dispatch(setCurrentUser(decoded));

  const currentTime = Date.now() / 1000;

  if (decoded.exp < currentTime) {
    store.dispatch(logoutUser());
    window.location.href = "./users/login";
  }
}

class App extends Component {

  render() {
    return (
      <Provider store={store}>
        <Router>
          <div>
            <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <Link to="/" className="navbar-brand">Todo App</Link>
            <div className="nav-wrapper collpase navbar-collapse">
              <ul className="navbar-nav z-depth-0 ml-auto hide-on-med-and-down">
                <li className="navbar-item">
                  <Link to="/" className="nav-link">My List</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/create" className="nav-link">Create Todo</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/users/register" className="nav-link">Signup</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/users/login" className="nav-link active hoverable">Login</Link>
                </li>
              </ul>
            </div>
          </nav>
          </div>
          <Route path="/" exact component={TodosList} />
          <Route path="/create" component={CreateTodo} />
          <Route path="/edit/:id" component={EditTodo} />
          <Route path="/delete/:id" component={DeleteTodo} />
          <Route path="/users/login" component={Login} />
          <Route path="/users/register" component={Register} />
          <PrivateRoute exact path="/" component={TodosList} />
        </Router>
      </Provider>

    );
  }
}

export default App;
