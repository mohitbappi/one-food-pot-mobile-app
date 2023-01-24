import axios from 'axios';
import Tost from 'react-native-toast-message';

const capitalizeFirstLetter = string =>
  string && string.charAt(0).toUpperCase() + string.substring(1);

export const axiosRequestConfig = {
  method: 'get', // default
  timeout: 1000 * 10, // default is `0` (no timeout)
  headers: {
    'content-type': 'application/json',
  },

  // `withCredentials` indicates whether or not cross-site Access-Control requests
  // should be made using credentials
  withCredentials: false, // default

  // `maxContentLength` defines the max size of the http
  // response content in bytes allowed in node.js
  maxContentLength: 2000,

  // `maxBodyLength` (Node only option) defines the max size of the http
  // request content in bytes allowed
  maxBodyLength: 2000,

  // If set to 0, no redirects will be followed.
  maxRedirects: 0, // default
};

axios.interceptors.request.use(
  // Do something before request is sent
  config => config,
  // Do something with request error
  error => Promise.reject(error),
);

const useInterceptor = ref => {
  ref.interceptors.response.use(
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    response => response,
    error => {
      console.log(JSON.stringify(error, 0, 6));
      console.log('error===', error?.response?.data);
      Tost.show({
        type: 'error',
        text1: capitalizeFirstLetter(
          error?.response?.data?.msg || 'something went wrong!!',
        ),
      });
    },
  );
};

class APIService {
  apiService;

  constructor() {
    this.initService();
  }

  initService() {
    const baseUrl = 'https://1foodpot.com';
    this.apiService = axios.create({...axiosRequestConfig, baseURL: baseUrl});
    useInterceptor(this.apiService);
  }
}

export const API = new APIService();
