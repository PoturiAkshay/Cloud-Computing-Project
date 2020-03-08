import axios from "axios";

/*This file contains all the rest api requests */

const base_url = "http://192.168.1.104:5000/";

class Service {
  getLocationData = location => {
  	console.log('I was triggered during componentDidMount');
    return axios.get(base_url + "search/" + location);
  };
}
export default Service;
