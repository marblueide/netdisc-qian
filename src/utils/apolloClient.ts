import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client/core";
import { createUploadLink } from "apollo-upload-client";

type Headers = {
  [key: string]: string;
};

const headers: Headers = {};

const upLoadLink = createUploadLink({
  uri: "http://localhost:3000/graphql",
  headers,
  
});

// // 与 API 的 HTTP 连接
// const httpLink = createHttpLink({
//   // 你需要在这里使用绝对路径
//   uri: 'http://localhost:3000/graphql',
//   headers
// })

// 缓存实现
const cache = new InMemoryCache();

// 创建 apollo 客户端
export const apolloClient = new ApolloClient({
  link: upLoadLink,
  cache,
});

export function setAuthorization(authorization: string) {
  headers["Authorization"] = `Bearer ${authorization}`;
}

export function removeAuthorization(){
  delete headers['Authorization']
}
