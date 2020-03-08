import React, { Component } from 'react';
import FormErrors from "../../FormErrors";
import Validate from "../../FormValidation";
import { Auth } from 'aws-amplify';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class SignUp extends Component {
  
  state = {
    email: "",
    password: "",
    name: "",
    dob: "",
    sex: "",
    phone: "",
    confirmpassword: "",
    errors: {
      cognito: null,
      blankfield: false,
      passwordmatch: false
    }
  }

  RemoveErrorState = () => {
    this.setState({
      errors: {
        cognito: null,
        blankfield: false,
        passwordmatch: false
      }
    });
  }

  SubmitAction = async event => {
    event.preventDefault();

    // Form validation
    this.RemoveErrorState();
    const error = Validate(event, this.state);
    if (error) {
      this.setState({
        errors: { ...this.state.errors, ...error }
      });
      return;
    }

    // AWS Cognito integration here

    const { email, password, name, dob, sex, phone } = this.state;

    try {

      const signUpResponse = await Auth.signUp({
        username: email,
        password,
        attributes: {
          name: name,
          'custom:Birthday': dob,
          gender: sex,
          phone_number: phone
          }
      });
      console.log(signUpResponse);
      this.props.history.push("/SignupConfirmation");
    } catch (error) {
      let err = null;
      !error.message ? err = { "message": error } : err = error;
      this.setState({
        errors: {
          ...this.state.errors,
          cognito: err
        }
      })
    }

  };

  onInputChange = event => {
    this.setState({
      [event.target.id]: event.target.value,
    });
    document.getElementById(event.target.id).classList.remove("is-danger");
  }

  handleChange = date => {
    this.setState({
      dob: date
    });
  };

  render() {
    return (
      <section className="section main">
        <div className="container">
          <FormErrors formerrors={this.state.errors} />

          <form onSubmit={this.SubmitAction}>
            <div className="field">
              <p className="controll">
                <input
                  className="input"
                  type="text"
                  id="name"
                  aria-describedby="NameHelper"
                  placeholder="Please Enter the Complete Name"
                  value={this.state.name}
                  onChange={this.onInputChange}
                />
              </p>
            </div>

            <p> Please Select the Gender</p>
            <div className="dropdown">
              <p>
                <select id="sex" value={this.state.sex} onChange={this.onInputChange}>
                  <option value="0"></option>
                  <option value="Male">Male</option>
                  <option value="Female">FeMale</option>
                  <option value="Other">Other</option>
                </select>
              </p>
            </div>

            <p> Please Enter the date of birth</p>
            <div className="div field">
                <DatePicker id="dob" className="input"
                  maxDate={new Date()}
                  selected={this.state.dob}
                  onChange={this.handleChange}
                />
            </div>

            <div className="field">
              <p className="control">
                <input
                  className="input"
                  type="text"
                  id="phone"
                  aria-describedby="Helper"
                  placeholder="Please Enter the mobile number along with country code"
                  value={this.state.phone}
                  onChange={this.onInputChange}
                />
              </p>
            </div>

            <div className="div field">
              <p className="control has-icons-left has-icons-right">
                <input
                  className="input"
                  type="email"
                  id="email"
                  aria-describedby="emailHelp"
                  placeholder="Please Enter email address"
                  value={this.state.email}
                  onChange={this.onInputChange}
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-envelope"></i>
                </span>
              </p>
            </div>
            <div className="div field">
              <p className="control has-icons-left">
                <input
                  className="input"
                  type="password"
                  id="password"
                  placeholder="Please Enter Password"
                  value={this.state.password}
                  onChange={this.onInputChange}
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-lock"></i>
                </span>
              </p>
            </div>
            <div className="div field">
              <p className="control has-icons-left">
                <input
                  className="input"
                  type="password"
                  id="confirmpassword"
                  placeholder="Please Confirm the password"
                  value={this.state.confirmpassword}
                  onChange={this.onInputChange}
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-lock"></i>
                </span>
              </p>
            </div>
            <div className="div field">
              <p className="control">
                <button className="button is-primary">
                  Sign Up
                </button>
              </p>
            </div>
          </form>
        </div>
      </section>
    );
  }
}

export default SignUp;