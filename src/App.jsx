import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard"

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/dashboard" component={Dashboard} />
          <Route path="/" component={Login} />
          <Route component={Dashboard} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
