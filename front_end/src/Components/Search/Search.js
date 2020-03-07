import React, { Component } from "react";
import "./Search.css";
import Descriptions from "../Descriptions/Descriptions";
import Service from "../../Service";
class Search extends Component {
  constructor(props) {
    super(props);
    this.state = { data: [], isLoading: false };
    this.service = new Service();
  }
  handleSubmit = event => {
    event.preventDefault();

    this.service
      .getLocationData(event.target.location.value)
      .then(res => {
        this.setState({ isLoading: false, data: res.data.items });
        console.log(res.data.items);
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
  bookTicket = Id => {
    this.setState({
      showView: true,
      id: Id
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
      <div className="container">
        <div className="mt-5">
          <form className="form-inline mr-auto" onSubmit={this.handleSubmit}>
            <input
              className="form-control col-lg-8"
              type="text"
              placeholder="Search"
              aria-label="Search"
              name="location"
            />
            <button
              className="btn btn-dark btn-rounded  my-0 ml-sm-2 col-lg-3"
              type="submit"
            >
              Search
            </button>
          </form>
        </div>
        <div>
          {/* map and populate data in table using 'Athlete' component for each row/record */}

          {this.state.data.map((row, index) => (
            <Descriptions
              // pass properties to child component
              key={row.id}
              data={row}
              onBook={this.bookTicket}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default Search;
