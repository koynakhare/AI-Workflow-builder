import axiosInstance from "./axios";

export const getApi = async (url, params = {}) => {
  const res = await axiosInstance.get(url, { params });
  return res?.data;
};

export const postApi = async (url, data = {}) => {
  const res = await axiosInstance.post(url, data);
  return res?.data;
};

export const putApi = async (url, data = {}) => {
  const res = await axiosInstance.put(url, data);
  return res?.data;
};

export const patchApi = async (url, data = {}) => {
  const res = await axiosInstance.patch(url, data);
  return res?.data;
};

export const deleteApi = async (url) => {
  const res = await axiosInstance.delete(url);
  return res?.data;
};