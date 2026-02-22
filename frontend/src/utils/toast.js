import { toast } from "react-toastify";

const getMessage = (msg, defaultMsg = "") =>
  typeof msg === "string" && msg.trim() ? msg : defaultMsg;

export const toastSuccess = (msg) =>
  toast.success(getMessage(msg, "Success"));

export const toastError = (msg) =>
  toast.error(getMessage(msg, "Something went wrong"));

export const toastInfo = (msg) =>
  toast.info(getMessage(msg, "Info"));

export const toastWarning = (msg) =>
  toast.warning(getMessage(msg, "Warning"));