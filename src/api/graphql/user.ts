import { ApolloQueryResult } from "@apollo/client";
import { provideApolloClient, useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { apolloClient } from "@/utils/apolloClient";
import { UserModel } from "@/types";

provideApolloClient(apolloClient);

export const login = (
  username: string,
  password: string
): Promise<ApolloQueryResult<{ login: UserModel }>> => {
  const { onResult, onError } = useQuery(
    gql`
      query login($loginInput: LoginInput!) {
        login(input: $loginInput) {
          id
          username
          name
          authorization
          diskSize
          useSize
        }
      }
    `,
    {
      loginInput: {
        username,
        password,
      },
    },
    {
      errorPolicy: "all",
    }
  );
  return new Promise((resolve, reject) => {
    onResult((res) => {
      res.data && resolve(res);
    });
    onError((error) => {
      reject(error.message);
    });
  });
};

export const register = (user: string, password: string) => {};
