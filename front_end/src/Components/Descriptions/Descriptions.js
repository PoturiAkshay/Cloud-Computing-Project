import React, { Component } from "react";
import "./Descriptions.css";

class Descriptions extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // componentWillMount(){}
  // componentDidMount(){}
  // componentWillUnmount(){}

  // componentWillReceiveProps(){}
  // shouldComponentUpdate(){}
  // componentWillUpdate(){}
  // componentDidUpdate(){}

  render() {
    return (
      <div key={this.props.data.id} className="col-lg-12 bg-light">
        <div>
          <h2 className="float-left">{this.props.data.name}</h2>
          <img className="clear-float" src={this.props.data.image}></img>
          <p>{this.props.data.description}</p>
        </div>
        <div>
          <h3 className="float-left">Highlights</h3>
          <p>{this.props.data.highlights}</p>
        </div>
        <h4>{this.props.data.price}</h4>
      </div>
    );
  }
}

export default Descriptions;
