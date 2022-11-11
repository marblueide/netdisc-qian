import { provideApolloClient, useMutation,useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { apolloClient } from "@/utils/apolloClient";
import { generRes } from "@/types";

provideApolloClient(apolloClient);


export const mergeFile = async (filename: string) => {
  const { mutate } = useMutation<{ mergerFile: generRes }, {}>(
    gql`
      mutation merge($filename: String!) {
        mergerFile(filename: $filename) {
          code
          message
        }
      }
    `,
    {
      variables: {
        filename,
      },
      fetchPolicy: "network-only",
    }
  );
  let res = await mutate();
  return res?.data?.mergerFile;
};


