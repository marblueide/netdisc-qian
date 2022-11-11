import axios from "axios";

const headers: {
  [prop in string]: string;
} = {};

const baseURL = "/api";

const instance = axios.create({
  baseURL,
  // baseURL:"http://localhost:8080/api",
});

instance.interceptors.request.use((config) => {
  for (const prop in headers) {
    //@ts-ignore
    config.headers[prop] = headers[prop];
  }
  return config;
});

instance.interceptors.response.use((res) => {
  let result = {
    data: res.data,
    code: res.status,
    headers: res.headers,
  };
  return result;
});

export const setHeaders = (name: string, value: string) => {
  headers[name] = value;
};

export const removeHeaders = (name: string) => {
  delete headers[name];
};

export default instance;
