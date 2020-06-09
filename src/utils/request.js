import axios from "axios";
import jsonBig from "json-bigint";

// creating axios instance
const instance = axios.create({
  baseURL: "http://ttapi.research.itcast.cn/app/",
});

// You can add interceptors to a custom instance of axios.
// Add a request interceptor
instance.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function(error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);

// use json-bigint package transform response json for prevent beyond int type, e.g id
// You can change defaults setting to a custom instance of axios.
// `transformResponse` allows changes to the response data to be made before
// it is passed to then/catch
instance.defaults.transformResponse = [
  function(data) {
    // Do whatever you want to transform the data
    try {
      return jsonBig.parse(data);
    } catch (e) {
      return [];
    }
  },
];

export default instance;
