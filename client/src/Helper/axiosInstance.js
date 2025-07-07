import axios from "axios";
// const BASE_URL = "http://localhost:5000/"
const BASE_URL = "https://vlogify-api.onrender.com/";


const axiosInstance = axios.create();
axiosInstance.defaults.baseURL = BASE_URL;
axiosInstance.defaults.withCredentials = true;

export default axiosInstance;
