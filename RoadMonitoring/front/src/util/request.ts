import Axios from 'axios';

const service = Axios.create({
  baseURL: process.env.VUE_APP_URL,
  timeout: 6000,
});
export default service;
