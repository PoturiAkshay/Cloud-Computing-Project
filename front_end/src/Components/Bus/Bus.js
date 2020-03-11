import React, { Component, useState } from "react";
import "./Bus.css";
import Purchase from "./Purchase";
import "../../css/style.css";

class Bus extends Component {
  constructor(props) {
    super(props);
    this.state = { seats_available: 1, active: false };
  }
  buyTickets = () => {
    this.toggleClass();
  };
  toggleClass = () => {
    const currentState = this.state.active;
    this.setState({ active: !currentState });
  };
  handleChange = e => {
    this.setState({
      seats_available: e.target.value
    });
  };
  // componentWillMount(){}
  // componentDidMount(){}
  // componentWillUnmount(){}

  // componentWillReceiveProps(){}
  // shouldComponentUpdate(){}
  // componentWillUpdate(){}
  // componentDidUpdate(){}

  render() {
    return (
      <li
        key={this.props.data.id}
        className={
          this.state.active ? "list-group-item  m-3 " : "list-group-item  m-3"
        }
      >
        <div className=" m-1 ">
          <div className="clearfix">
            <div className="float-left">
              <h4 className="h4 text-left">
                Bus Number: {this.props.data.bus_no}
              </h4>

              <span className=" text-left h4">
                {this.props.data.src} <i>({this.props.data.arr_time})</i>
                ->
                {this.props.data.dest} <i>({this.props.data.dep_time})</i>{" "}
              </span>

              <p className="text-left">
                <label htmlFor="num_passenger">Number of Passengers: </label>
                <input
                  type="number"
                  id="num_passenger"
                  name="num_passenger"
                  min={this.state.seats_available}
                  value={this.state.seats_available}
                  max={this.props.data.seats}
                  onChange={this.handleChange}
                  required
                />
              </p>
            </div>

            <div className="float-right">
              <p className="h3">
                Price:{" "}
                <var>
                  <abbr title="CAD">$</abbr>
                  {10 * this.state.seats_available}
                </var>
              </p>
              <button
                className="btn btn-outline-primary"
                onClick={this.buyTickets}
              >
                Buy Tickets
              </button>
            </div>
          </div>
        </div>

        <div className={this.state.active ? "fadeIn" : "fadeOut"}>
          <Purchase></Purchase>
        </div>
      </li>
    );
  }
}

export default Bus;
