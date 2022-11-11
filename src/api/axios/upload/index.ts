import axios from "@/utils/axios";
import { AxiosProgressEvent, AxiosRequestConfig } from "axios";

export interface uploadBigFileDto {
  chunk: any;
  hash: string;
  path: string;
  filename: string;
}

export const baseAxiosUpload = (
  {
    path,
    file,
  }: {
    path: string;
    file: File;
  },
  config?: AxiosRequestConfig
) => {
  const params = new FormData();
  params.append("path", path);
  params.append("file", file);
  params.append("filename", file.name);
  return axios.post("/file/upload", params, config);
};

export const verify = (
  path: string,
  filename: string,
  hash: string,
  isBigFile: boolean = false
) => {
  return axios.post<{
    shouldUpload: boolean;
    fileList: string[];
  }>("/file/verify", {
    filename,
    path,
    hash,
    isBigFile,
  });
};

export const bigAxiosUpload = (
  { chunk, filename, path, hash }: uploadBigFileDto,
  config?: AxiosRequestConfig
) => {
  console.log(path)
  const data = new FormData();
  data.append("file", chunk);
  data.append("filename", filename);
  data.append("path", path);
  data.append("hash", hash);
  return axios.post("/file/uploadBig", data, config);
};

export const mergeBigFile = (filename: string,path:string,config?: AxiosRequestConfig) => {
  return axios.post("/file/mergerFile", {
    filename,
    path
  },config);
};
