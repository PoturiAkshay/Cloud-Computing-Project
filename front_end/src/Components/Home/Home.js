import React, { Component } from "react";
import { IndexLinkContainer } from "react-router-bootstrap";
import logo from "../../images/logo.png";

/* This component provides routing functionality between components.
Contains two childern component 'Athletes' and 'Upload Athletes' 
*/

class Home extends Component {
  render() {
    return (
      // Banner with logo
      <div className="masthead">
        <header className="container-fluid">
          <div className="p-4">
            <div className="logo float-left">
              <IndexLinkContainer to="/" className=" ">
                {/* Logo image */}
                <img alt="logo" src={logo}></img>
              </IndexLinkContainer>
            </div>
            <div className="float-right">
              <button className="btn btn-primary ">Login</button>
            </div>
            <div className="clearfix"></div>
          </div>
        </header>
        {/* Navigation bar */}
        <nav className="navbar navbar-expand-sm navbar-light bg-light text-primary justify-content-between pd-5">
          <div className="row ">
            <div className="navbar-header col-sm-12 col-lg-12 col-ms-12">
              <ul className="navbar-nav">
                <li className="nav-item col-sm-4 col-lg-4 col-md-4 nav-link">
                  {/* Routing */}
                  <IndexLinkContainer to="/Search">
                    <a className="nav-link" href="/">
                      <b>Search</b>
                    </a>
                  </IndexLinkContainer>
                </li>
                <li className="nav-item col-sm-6 col-lg-6 col-md-6 nav-link">
                  <IndexLinkContainer to="/Orders">
                    <a className="nav-link" href="/">
                      <b>Order Details</b>
                    </a>
                  </IndexLinkContainer>
                </li>
                <li className="nav-item col-sm-4 col-lg-4 col-md-4 nav-link">
                  <IndexLinkContainer to="/Analytics">
                    <a className="nav-link" href="/">
                      <b>Analytics</b>
                    </a>
                  </IndexLinkContainer>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </div>
    );
  }
}

export default Home;
