import { userStore } from "@/store";
import axios from "axios";
import router from "@/router";

const headers: {
  [prop in string]: string;
} = {};

const baseURL = "/api";

const instance = axios.create({
  baseURL,
  // baseURL:"http://localhost:8080/api",
});

instance.interceptors.request.use((config) => {
  const authorization = localStorage.getItem("Authorization");
  //@ts-ignore
  config.headers.Authorization = `Bearer ${authorization}`;
  return config;
});

instance.interceptors.response.use(
  (res) => {
    let result = {
      data: res.data,
      code: res.status,
      headers: res.headers,
    };
    return result;
  },
  (error) => {
    const store = userStore();
    if (error.response.status == 401) {
      store.outLogin();
      router.push({ name: "login" });
    }
  }
);

export const setHeaders = (name: string, value: string) => {
  headers[name] = value;
};

export const removeHeaders = (name: string) => {
  delete headers[name];
};

export default instance;
