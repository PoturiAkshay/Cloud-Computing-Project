import React, { Component } from "react";
import "./Book.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Service from "../../Service";
import Bus from "../Bus/Bus";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class Book extends Component {
  constructor(props) {
    super(props);
    this.state = {
      destId: this.props.destId,
      sources: [],
      selectedSource: "",
      data: [],
      date: "",
      active: false
    };
    this.service = new Service();
  }

  // componentWillMount(){}
  componentDidMount() {
    this.service
      .getSources(this.state.destId)
      .then(res => {
        this.setState({ sources: res.data.result });
      })
      //Error handling
      .catch(error => {
        //data is empty in case of error.
        this.setState({
          data: []
        });
      });
  }

  onSubmit = event => {
    event.preventDefault();
    // fetch buses from selected source to destination
    this.service
      .getBuses(event.target.source.value, this.state.destId)
      .then(res => {
        this.setState({ data: res.data.result });
        if (res.data.result.length == 0) alert("No buses found");
      })
      //Error handling
      .catch(error => {
        //data is empty in case of error.
        this.setState({
          data: []
        });
      });
  };

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
            {/* list of source location */}
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
          {/* travel date */}
          <div className="form-group">
            <label htmlFor="date">Select date:</label>
            <input
              min={
                new Date().getFullYear() +
                "-" +
                ("0" + (new Date().getMonth() + 1)).slice(-2) +
                "-" +
                ("0" + new Date().getDate()).slice(-2)
              }
              className="form-control"
              name="date"
              type="date"
              required
              dateFormat="yyyy-mm-dd"
              // onChange={e => this.setState({ date: e.target.value })}
              onChange={date => this.setState({ date: date })}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            See Buses
          </button>
        </form>
        {this.state.data.length > 0 && (
          <div className="d-flex justify-content-center col">
            <ul className="list-group col-lg-8 ">
              {/* show buses */}
              {this.state.data.map((row, index) => (
                <Bus
                  // pass properties to child component
                  key={index}
                  data={row}
                  index={index}
                  user={this.props.user}
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
