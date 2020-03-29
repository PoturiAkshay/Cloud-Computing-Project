import React, { Component } from "react";
import "./Analytics.css";
import Service from "../../Service";

class Analytics extends Component {
  constructor(props) {
    super(props);
    this.state = { isLoading: true, data: [] };
    this.service = new Service();
  }

  // componentWillMount(){}
  componentDidMount() {
    const Plotly = window.Plotly;
    this.service
      .getAnalytics(1)
      .then(res => {
        this.setState({ isLoading: false, data: res.data });
        // var layout = {
        //   xaxis: { autorange: true },
        //   yaxis: { autorange: true }
        // };

        // Plotly.react("analytics", {
        //   data: res.data,
        //   layout: layout
        // });
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
  // componentWillUnmount(){}

  // componentWillReceiveProps(){}
  // shouldComponentUpdate(){}
  // componentWillUpdate(){}
  // componentDidUpdate(){}

  render() {
    return (
      <frameset scrolling="no" rows="50%,*,10%" cols="25%,*,25%">
        <frame src="https://dbe6st6u2k.execute-api.us-east-1.amazonaws.com/dev/analytics" />

        <noframes>
          Your browser does not support frames. To wiew this page please use
          supporting br
        </noframes>
      </frameset>
    );
  }
}

export default Analytics;
