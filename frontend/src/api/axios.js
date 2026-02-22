import axios from "axios";
import { toastError } from "../utils/toast";
import { logout } from "../utils/helper";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = "Something went wrong";

    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 400:
          message = data?.message || "Bad request";
          break;


        case 401:
          logout();
          message = "Session expired. Please login again";
          break;

        case 403:
          message = "You are not authorized to access this";
          break;

        case 404:
          message = "Resource not found";
          break;

        case 500:
          message = "Internal server error";
          break;

        default:
          message = data?.message || "Unexpected error occurred";
      }
    }

    else if (error.request) {
      message = "Server not responding. Check internet connection";
    }

    else {
      message = error.message;
    }

    toastError(message);

    return Promise.reject(error);
  }
);

export default axiosInstance;