import React, { Component } from "react";
import "./Book.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

class Book extends Component {
  constructor(props) {
    super(props);
    this.state = { id: this.props.id };
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
      <div>
        <button className="btn btn-outline-default btn-default float-left">
          <FontAwesomeIcon
            icon={faArrowLeft}
            className="float-left fa-lg align-middle  mr-2 btn-link text-dark "
            //go back to the main page.
            onClick={() => this.props.onBack()}
          />
        </button>
        <div>Book</div>
      </div>
    );
  }
}

export default Book;
