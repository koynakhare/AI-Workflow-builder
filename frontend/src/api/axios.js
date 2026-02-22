import axios from "axios";
import { getStorageItem, handleApiError } from "../utils/helper";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getStorageItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  Promise.reject
);

axiosInstance.interceptors.response.use(
  (response) => response,
  handleApiError
);

export default axiosInstance;