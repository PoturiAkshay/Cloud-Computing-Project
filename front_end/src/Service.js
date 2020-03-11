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
  getSources = () => {
    return axios.get(base_url + "/getSources");
  };
  getBuses = (sourceId, destId) => {
    return axios.get(base_url + "/getBuses/" + sourceId + "/" + destId);
  };
}
export default Service;
