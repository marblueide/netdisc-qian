import {
  ApolloError,
  ApolloQueryResult,
  FetchResult,
} from "@apollo/client";
import { provideApolloClient,useMutation,useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { apolloClient } from "@/utils/apolloClient";
import { fileObj, generRes } from "@/types";

provideApolloClient(apolloClient);

export const getDirectoryList = async (
  dir: string
): Promise<ApolloQueryResult<{ getPath: fileObj[] }>> => {
  const { onResult, onError } = useQuery(
    gql`
      query getPath($path: String!) {
        getPath(path: $path) {
          name
          update
          size
          directory
          type
          imgSrc
        }
      }
    `,
    {
      path: dir,
    },
    {
      errorPolicy: "all",
      fetchPolicy: "network-only",
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

export const deleteFile = (
  paths: string[]
): Promise<FetchResult<{ deleteDir: generRes }>> => {
  paths = paths.map((path) => path.replace("//", "/"));
  const { onDone, onError, mutate } = useMutation(
    gql`
      mutation deleteDir($paths: [String!]!) {
        deleteDir(paths: $paths) {
          code
          message
        }
      }
    `,
    {
      variables: {
        paths,
      },
    }
  );
  mutate();
  return new Promise((resovle, reject) => {
    onDone((res) => {
      res.data && resovle(res);
    });
    onError(reject);
  });
};

export const createDirectory = (
  path: string,
  name: string
): Promise<FetchResult<{ mkdir: generRes }>> => {
  const { onDone, onError, mutate } = useMutation(
    gql`
      mutation mkdir($mkdirPath: String!) {
        mkdir(path: $mkdirPath) {
          code
          message
        }
      }
    `,
    {
      variables: {
        mkdirPath: `${path}/${name}`.replace("//", "/"),
      },
    }
  );
  mutate();
  return new Promise((resovle, reject) => {
    onDone((res) => {
      res.data && resovle(res);
    });
    onError(reject);
  });
};

export const reName = (
  path: string,
  lastName: string,
  nextName: string
): Promise<FetchResult<{ reName: generRes }>> => {
  path.replace("//", "/");
  const { onDone, onError, mutate } = useMutation(
    gql`
      mutation reName($reNameInput: reNameInput!) {
        reName(input: $reNameInput) {
          code
          message
        }
      }
    `,
    {
      variables: {
        reNameInput: {
          path,
          lastName,
          nextName,
        },
      },
    }
  );
  mutate();
  return new Promise((resovle, reject) => {
    onDone((res) => {
      res.data && resovle(res);
    });
    onError(reject);
  });
};
