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
}
export default Service;
