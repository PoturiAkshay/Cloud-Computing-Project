import React, { Component } from "react";
import "./Search.css";
import Descriptions from "../Descriptions/Descriptions";
import Service from "../../Service";
import Book from "../Book/Book";
class Search extends Component {
  constructor(props) {
    super(props);
    this.state = { data: [], isLoading: false, showBook: false, id: "" };
    this.service = new Service();
  }
  handleSubmit = event => {
    event.preventDefault();

    this.service
      .getLocationData(event.target.location.value)
      .then(res => {
        this.setState({ isLoading: false, data: res.data.items });
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
  handleBack = () => {
    this.setState({
      showBook: false
    });
  };
  bookTicket = destId => {
    this.setState({
      showBook: true,
      destId: destId
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
        {!this.state.showBook && (
          <div>
            <div className="mt-5">
              <form
                className="form-inline mr-auto d-flex justify-content-center"
                onSubmit={this.handleSubmit}
              >
                <input
                  className="form-control col-lg-9 col-md-9"
                  type="text"
                  placeholder="Search"
                  aria-label="Search"
                  name="location"
                />
                <button
                  className="btn btn-dark btn-rounded  my-0 ml-sm-2 col-lg-2 col-md-2"
                  type="submit"
                >
                  Search
                </button>
              </form>
            </div>
            <div>
              <ul className="list-group d-flex justify-content-center">
                {/* map and populate data in table using 'Athlete' component for each row/record */}

                {this.state.data.map((row, index) => (
                  <Descriptions
                    // pass properties to child component
                    key={row.id}
                    data={row}
                    onBook={this.bookTicket}
                  />
                ))}
              </ul>
            </div>
          </div>
        )}
        {this.state.showBook && (
          <Book
            // pass properties to child component
            destId={this.state.destId}
            onBack={this.handleBack}
          />
        )}
      </div>
    );
  }
}

export default Search;
