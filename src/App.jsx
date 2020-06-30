import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard"

import { Provider } from 'react-redux';
import store from './redux/store';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <Switch>
            <Route exact path="/app" component={Dashboard} />
            <Route exact path="/app/*" component={Dashboard} />
            <Route path="/" component={Login} />
          </Switch>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
