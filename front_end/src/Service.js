import axios from "axios";

/*This file contains all the rest api requests */

const base_url = "http://127.0.0.1:5000/";

class Service {
  getLocationData = location => {
    return axios.get(base_url + "search/" + location);
  };
  getOrderDeatils = id => {
    return axios.get(base_url + "orderDetails/" + id);
  };
  getAnalytics = () => {
    return axios.get(base_url + "analytics");
  };
  getSources = destId => {
    return axios.get(base_url + "getSources/" + destId);
  };
  getBuses = (sourceId, destId) => {
    return axios.get(base_url + "getBuses/" + sourceId + "/" + destId);
  };
  makePayment = data => {
    return axios.post(base_url + "makePayment", data);
  };
  postUserDetails = user_data => {
    return axios.post(base_url + "registration/", user_data);
  };
}
export default Service;
