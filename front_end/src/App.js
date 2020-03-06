import React from "react";

import "./App.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import Home from "./Components/Home/Home";
import Search from "./Components/Search/Search";
import Analytics from "./Components/Analytics/Analytics";
import Orders from "./Components/Orders/Orders";
import Book from "./Components/Book/Book";
import Login from "./Components/Login/Login";
import SignUp from "./Components/SignUp/SignUp";

function App() {
  return (
    // Navigation between different components.
    <Router>
      <div className="App">
        <Home />
        <Switch>
          <Redirect exact from="/" to="/Search" />
          <Route path="/Search" component={Search}></Route>
          <Route path="/Analytics" component={Analytics}></Route>
          <Route path="/Orders" component={Orders}></Route>
          <Route path="/Book" component={Book}></Route>
          <Route path="/Login" component={Login}></Route>
          <Route path="/SignUp" component={SignUp}></Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
