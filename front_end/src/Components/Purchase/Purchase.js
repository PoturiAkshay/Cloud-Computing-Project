import React, { Component } from "react";
import "./Purchase.css";
import Service from "../../Service";
import { Modal } from "react-bootstrap";

import {
  formatCreditCardNumber,
  formatCVC,
  formatExpirationDate
} from "./validation";

class Purchase extends Component {
  constructor(props) {
    super(props);
    this.state = { cardNumber: "", cvv: "", date: "", showModal: false };
    this.service = new Service();
  }

  onPayment = event => {
    // event.preventDefault();
    // const data = new FormData(event.target);
    // data.append("source_id", this.props.busInfo.data.src_id);
    // data.append("dest_id", this.props.busInfo.data.dest_id);
    // data.append("date", this.props.date);
    // data.append("numPass", this.props.numPass);
    // data.append("price", this.props.busInfo.data.price);
    // data.append("userId", 1);
    // this.service
    //   .makePayment(data)
    //   .then(res => {
    //     // this.setState({ showModal: true });
    //   })
    //   //Error handling
    //   .catch(error => {
    //     //data is empty in case of error.
    //     this.setState({
    //       isLoading: false,
    //       data: []
    //     });
    //   });
  };
  // componentWillMount(){}
  componentDidMount() {
    console.log(this.props);
  }
  // componentWillUnmount(){}

  // componentWillReceiveProps(){}
  // shouldComponentUpdate(){}
  // componentWillUpdate(){}
  // componentDidUpdate(){}

  render() {
    return (
      // Navigation between different components.
      <div className="container">
        <div className="">
          <div className="">
            <div className="panel panel-default">
              <div className="panel-heading">
                <h3 className="panel-title">Payment Details</h3>
              </div>
              <div className="panel-body">
                <form
                  role="form"
                  method="post"
                  action="http://127.0.0.1:5000/makePayment"
                  // target="_blank"
                >
                  <input
                    type="hidden"
                    name="source_id"
                    value={this.props.busInfo.data.src_id}
                  ></input>

                  <input
                    type="hidden"
                    name="dest_id"
                    value={this.props.busInfo.data.dest_id}
                  ></input>
                  <input
                    type="hidden"
                    name="bus_id"
                    value={this.props.busInfo.data.id}
                  ></input>
                  <input
                    type="hidden"
                    name="date"
                    value={this.props.date}
                  ></input>
                  <input
                    type="hidden"
                    name="numPass"
                    value={this.props.numPass}
                  ></input>
                  <input
                    type="hidden"
                    name="price"
                    value={this.props.busInfo.data.price}
                  ></input>
                  <input type="hidden" name="userId" value="1"></input>

                  <div className="form-group">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        name="cardName"
                        placeholder="Name on Card"
                        type="text"
                        required
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        name="cardNumber"
                        pattern="[\d| ]{16,22}"
                        placeholder="Card Number(16-22 digits)"
                        required
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      name="expiryDate"
                      pattern="\d\d/\d\d"
                      placeholder="Valid Thru (MM/YY)"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      className="form-control"
                      name="cvCode"
                      pattern="\d{3,4}"
                      placeholder="CVC (3 digits)"
                      required
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="btn btn-success btn-lg btn-block"
                      role="button"
                    >
                      Pay
                    </button>
                  </div>
                </form>
                {/* {this.state.showModal && ( */}
                <Modal show={this.state.showModal} onHide={this.props.onClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Delete</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    Are you sure you wish to delete the record?
                  </Modal.Body>
                  <Modal.Footer>
                    {/* Close popup */}
                    <button
                      variant="secondary"
                      onClick={this.props.onClose}
                      className="btn btn-outline-secondary"
                    >
                      Close
                    </button>
                    {/*  Delete reocrod on confirmation */}
                    <button
                      autoFocus
                      className="btn btn-danger"
                      variant="primary"
                    >
                      Delete
                    </button>
                  </Modal.Footer>
                </Modal>
                {/* )} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Purchase;

// https://codesandbox.io/s/react-final-form-credit-card-example-ur4tl
