import React, { Component } from "react";
import "./Book.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Service from "../../Service";
import Bus from "../Bus/Bus";

class Book extends Component {
  constructor(props) {
    super(props);
    this.state = {
      destId: this.props.id,
      sources: [],
      selectedSource: "",
      data: [],
      active: false
    };
    this.service = new Service();
  }

  // componentWillMount(){}
  componentDidMount() {
    this.service
      .getSources()
      .then(res => {
        this.setState({ isLoading: false, sources: res.data.result, date: "" });
      })
      //Error handling
      .catch(error => {
        //data is empty in case of error.
        this.setState({
          isLoading: false,
          data: []
        });
      });
  }

  onSubmit = event => {
    event.preventDefault();

    this.service
      .getBuses(event.target.source.value, this.props.destId)
      .then(res => {
        this.setState({ isLoading: false, data: res.data.result });
        console.log(res);
      })
      //Error handling
      .catch(error => {
        //data is empty in case of error.
        this.setState({
          isLoading: false,
          data: []
        });
      });
  };
  purchaseTicket = () => {
    console.log("purchase");
  };
  // handleChange = event => {
  //   console.log(event.target.value);
  // };
  // componentWillUnmount(){}

  // componentWillReceiveProps(){}
  // shouldComponentUpdate(){}
  // componentWillUpdate(){}
  // componentDidUpdate(){}

  render() {
    return (
      <div>
        <button className="btn btn-outline-default btn-default float-left">
          <FontAwesomeIcon
            icon={faArrowLeft}
            className="float-left fa-lg align-middle  mr-2 btn-link text-dark "
            //go back to the main page.
            onClick={() => this.props.onBack()}
          />
        </button>
        <form onSubmit={this.onSubmit} className="mt-5">
          <div className="form-group">
            <label htmlFor="source">Select source:</label>
            <select
              className="form-control"
              name="source"
              value={this.state.selectedSource}
              onChange={e => this.setState({ selectedSource: e.target.value })}
            >
              {this.state.sources.map((e, key) => {
                return (
                  <option key={e.sourceId} value={e.sourceId}>
                    {e.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="date">Select date:</label>
            <input
              className="form-control"
              name="date"
              type="date"
              required
              onChange={e => this.setState({ date: e.target.value })}
              // ref={date => {
              //   this.dateRef = date;
              // }}
              // value={this.state.date}
              // onChange={this._onDateChange.bind(this)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            See Buses
          </button>
        </form>
        {this.state.data.length > 0 && (
          <div className="d-flex justify-content-center col">
            <ul className="list-group col-lg-8 ">
              {this.state.data.map((row, index) => (
                <Bus
                  // pass properties to child component
                  key={index}
                  data={row}
                  index={index}
                  date={this.state.date}
                  isActive={index => this.setState({ activeItem: index })}
                  activeIndex={this.state.activeItem}
                />
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }
}

export default Book;
