import { ApolloError, OperationVariables } from "@apollo/client";
import {
  useMutation as mutate,
  UseMutationReturn,
  useQuery as query,
} from "@vue/apollo-composable";
import {
  DocumentParameter,
  OptionsParameter,
} from "@vue/apollo-composable/dist/useQuery";

export const useMutation = (
  errorMiddleFn: (param: ApolloError) => void = () => {},
  ...middles:(() => void)[]
) => {
  return <
    TResult = any,
    TVariables extends OperationVariables = OperationVariables,
  >(
    document: DocumentParameter<TResult, TVariables>,
    options?: OptionsParameter<TResult, TVariables>
  ) => {
    middles.forEach(fn => fn())
    const res = mutate<TResult, TVariables>(document, options as any);
    const { onError,onDone } = res;
    const handleOnError = (fn: (param: ApolloError) => void) => {
      onError((error) => {
        errorMiddleFn(error);
        fn(error);
      });
    };
    return {
      ...res,
      onError: handleOnError,
    };
  };
};

export const useQuery = (
  errorMiddleFn: (param: ApolloError) => void = () => {},
  ...middles:(() => void)[]
) => {
  return <TResult = any>(
    document: DocumentParameter<TResult, undefined>,
    variables: any,
    options: OptionsParameter<TResult, null>
  ) => {
    middles.forEach(fn => fn())
    const res = query(document, variables, options);
    const { onError } = res;
    const handleOnError = (fn: (param: ApolloError) => void) => {
      onError((error) => {
        errorMiddleFn(error);
        fn(error);
      });
    };

    return {
      ...res,
      onError: handleOnError,
    };
  };
};
