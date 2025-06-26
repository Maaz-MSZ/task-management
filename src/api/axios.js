import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3001", //set the base URL
});

export default API;