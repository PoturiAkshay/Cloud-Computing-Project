import axios from "axios";

/*This file contains all the rest api requests */

// const base_url = "http://127.0.0.1:5000/";
const base_url = "https://dbe6st6u2k.execute-api.us-east-1.amazonaws.com/dev/";

// const search_url = "http://search-loadbalancer-942614477.us-east-1.elb.amazonaws.com/";
// const orders_url = "http://orders-loadbalancer-1449102389.us-east-1.elb.amazonaws.com/";
// const analytics_url = "http://analytics-loadbalancer-653387818.us-east-1.elb.amazonaws.com/";
const booking_url = "http://booking-loadbalancer-197985461.us-east-1.elb.amazonaws.com/";
const payment_url = "http://payment-loadbalancer-204535818.us-east-1.elb.amazonaws.com/";
const reg_url = "http://payment-loadbalancer-204535818.us-east-1.elb.amazonaws.com/";

class Service {
  getLocationData = location => {
    return axios.get(base_url + "search/" + location);
    // return axios.get(search_url + "search/" + location);
  };
  getOrderDeatils = id => {
    return axios.get(base_url + "orderdetails/" + id);
    // return axios.get(orders_url + id);
  };
  getAnalytics = () => {
    return axios.get(base_url + "analytics");
    // return axios.get(analytics_url);
  };
  getSources = destId => {
    return axios.get(base_url + "getSources/" + destId);
  };
  getBuses = (sourceId, destId) => {
    return axios.get(base_url + "getBuses/" + sourceId + "/" + destId);
  };
  makePayment = data => {
    return axios.post(payment_url + "makePayment", data);
  };
  postUserDetails = user_data => {
    return axios.post(reg_url + "registration/", user_data);
  };
}
export default Service;
