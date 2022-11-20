import router from "@/router";
import {
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  ApolloLink,
  from,
} from "@apollo/client/core";
// let userStore;
type Headers = {
  [key: string]: string;
};
let userStore: () => any;
const headers: Headers = {};

export function setAuthorization(authorization: string) {
  headers["Authorization"] = `Bearer ${authorization}`;
}

export function removeAuthorization() {
  delete headers["Authorization"];
}

// const upLoadLink = createUploadLink({
//   uri: "http://localhost:3000/graphql",
//   headers,
// });

// // 与 API 的 HTTP 连接
const httpLink = createHttpLink({
  // 你需要在这里使用绝对路径
  uri: "http://localhost:3000/graphql",
  headers,
});

const AuthLink = new ApolloLink((operation, forward) => {
  const authorization = localStorage.getItem("Authorization");
  !authorization && removeAuthorization();
  return forward(operation).map((data) => {
    data.errors?.forEach((err) => {
      if (err.message.toLocaleUpperCase().includes("UNAUTHORIZED")) {
        import("@/store/userStore").then(({ userStore }) => {
          const store = userStore();
          store.outLogin();
          router.push({ name: "login" });
        });
      }
    });
    return data;
  });
});

const link = from([AuthLink, httpLink]);

// 缓存实现
const cache = new InMemoryCache();

// 创建 apollo 客户端
export const apolloClient = new ApolloClient({
  link,
  cache,
});
