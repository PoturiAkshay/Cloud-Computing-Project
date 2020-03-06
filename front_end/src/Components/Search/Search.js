import React, { Component } from "react";
import "./Search.css";
import Descriptions from "../Descriptions/Descriptions";

class Search extends Component {
  // constructor(props){
  // super(props);
  // this.state = {};
  // }

  // componentWillMount(){}
  // componentDidMount(){}
  // componentWillUnmount(){}

  // componentWillReceiveProps(){}
  // shouldComponentUpdate(){}
  // componentWillUpdate(){}
  // componentDidUpdate(){}

  render() {
    return (
      <div className="container">
        <div className="md-form   mt-5">
          <input
            className="form-control"
            type="text"
            placeholder="Search"
            aria-label="Search"
          />
        </div>
        <div>
          <Descriptions></Descriptions>
        </div>
      </div>
    );
  }
}

export default Search;
