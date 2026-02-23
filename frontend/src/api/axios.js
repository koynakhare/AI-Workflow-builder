import axios from "axios";
import { getStorageItem, handleApiError } from "../utils/helper";
import { appConfig } from "../config";

const axiosInstance = axios.create({
  baseURL: appConfig.baseURL || "/",
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