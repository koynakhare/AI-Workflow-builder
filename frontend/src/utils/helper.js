import { toastError } from "./toast";
import { isEmpty } from "lodash";

export const logout = (redirect = true) => {
  localStorage.removeItem("token");
  if (redirect) {
    window.location.href = "/login";
  }
};

export const getStorageItem = (key, defaultValue = null) => {
  try {
    if (!key || typeof key !== "string") return defaultValue;

    const value = localStorage.getItem(key);

    if (!isEmpty(value)) return defaultValue;

    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  } catch (error) {
    console.error("Storage get error:", error);
    return defaultValue;
  }
};

const STATUS_MESSAGES = {
  400: "Bad request",
  401: "Session expired. Please login again",
  403: "You are not authorized to access this",
  404: "Resource not found",
  500: "Internal server error",
};

export const handleApiError = (error) => {
  let message = "Something went wrong";

  if (error?.response) {
    const { status, data } = error.response;

    if (status === 401) {
      logout();
    }

    message =
      data?.message ||
      STATUS_MESSAGES[status] ||
      "Unexpected error occurred";
  }

  else if (error?.request) {
    message = "Server not responding. Check internet connection";
  }

  else {
    message = error?.message || message;
  }

  toastError(message);

  return Promise.reject(error);
};