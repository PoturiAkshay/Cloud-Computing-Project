import React, { Component } from 'react';
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
import SignupConfirmation from "./Components/SignUp/SignupConfirmation";
import ForgotPassword from "./Components/ForgotPassword/ForgotPassword";
import ForgotPasswordVerification from "./Components/ForgotPassword/ForgotPasswordVerification";
import PasswordChangeConfirmation from "./Components/ForgotPassword/PasswordChangeConfirmation";
import LoginConfirmation from "./Components/Login/LoginConfirmation";
import { Auth } from 'aws-amplify';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
library.add(faEdit);

class App extends Component {
  state = {
    isAuthenticated: false,
    isAuthenticating: true,
    user: null
  }

  setAuthStatus = authenticated => {
    this.setState({ isAuthenticated: authenticated });
  }

  setUser = user => {
    this.setState({ user: user });
  }

  async componentDidMount() {
    try {
      const session = await Auth.currentSession();
      this.setAuthStatus(true);
      console.log(session);
      const user = await Auth.currentAuthenticatedUser();
      this.setUser(user);

    } catch (error) {
      console.log(error);
    }
    this.setState({ isAuthenticating: false });
  }
  render() {

    const authprops = {
      isAuthenticated: this.state.isAuthenticated,
      user: this.state.user,
      setAuthStatus: this.setAuthStatus,
      setUser: this.setUser
    }
    return (
      // Navigation between different components.
      !this.state.isAuthenticating &&
      <div className="App">
        <Router>
          <div className="App">
            <Home auth={authprops} />
            <Switch>
              <Redirect exact from="/" to="/Search" />
              <Route path="/Search" component={Search}></Route>
              <Route path="/Analytics" component={Analytics}></Route>
              <Route path="/Orders" component={Orders}></Route>
              <Route path="/Book" component={Book}></Route>
              <Route exact path="/Login" render={(props) => <Login {...props} auth={authprops} />} ></Route>
              <Route exact path="/SignUp" render={(props) => <SignUp {...props} auth={authprops} />} ></Route>
              <Route exact path="/ForgotPassword" render = {(props) => <ForgotPassword {...props}  auth={authprops}/>} />
              <Route exact path="/ForgotPasswordVerification" render = {(props) => <ForgotPasswordVerification {...props}  auth={authprops}/>} />
              <Route exact path="/SignupConfirmation" render = {(props) => <SignupConfirmation  {...props}  auth={authprops}/>} />
              <Route exact path="/PasswordChangeConfirmation" render = {(props) => <PasswordChangeConfirmation  {...props}  auth={authprops}/>} />
              <Route exact path="/LoginConfirmation" render = {(props) => <LoginConfirmation  {...props}  auth={authprops}/>} />
            </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
