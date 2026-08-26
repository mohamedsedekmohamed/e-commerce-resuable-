import axios from 'axios';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useTranslations } from 'next-intl';

type ApiFunction = (...args: never[]) => Promise<unknown>;
type ResponseData<T> = T extends { data: infer Data } ? Data : T;
type ValidationErrors = Record<string, string | string[]>;

interface ApiErrorBody {
  message?: string;
  errors?: ValidationErrors;
}

interface ActionOptions {
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMsg?: string;
}

function unwrapResponse<T>(response: T): ResponseData<T> {
  if (typeof response === 'object' && response !== null && 'data' in response) {
    return (response as { data: ResponseData<T> }).data;
  }

  return response as ResponseData<T>;
}

function readApiError(error: unknown) {
  if (axios.isAxiosError<ApiErrorBody>(error)) {
    const body = error.response?.data;
    const errors = body?.errors ?? {};
    const messages = Object.values(errors)
      .flatMap((value) => Array.isArray(value) ? value : [value])
      .filter((message): message is string => typeof message === 'string' && message.length > 0);

    return {
      errors,
      messages,
      message: body?.message || messages[0] || error.message,
    };
  }

  return {
    errors: {},
    messages: [],
    message: error instanceof Error ? error.message : undefined,
  };
}

export function useApiGet<T extends ApiFunction>(
  apiFunction: T,
  ...args: Parameters<T>
) {
  type Data = ResponseData<Awaited<ReturnType<T>>>;

  const [data, setData] = useState<Data | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isFirstLoad = useRef(true);
  const t = useTranslations('common');

  const execute = useCallback(async () => {
    // Skip execution if any argument is explicitly 0, '0', null, or undefined
    if (args.some((arg) => arg === 0 || arg === '0' || arg === null || arg === undefined || arg === '')) {
      setIsLoading(false);
      setIsFetching(false);
      return;
    }

    setIsFetching(true);
    if (isFirstLoad.current) {
      setIsLoading(true);
    }
    setError(null);

    try {
      const request = apiFunction as unknown as (...requestArgs: Parameters<T>) => ReturnType<T>;
      const response = await request(...args);
      setData(unwrapResponse(response) as Data);
    } catch (requestError: unknown) {
      const { message } = readApiError(requestError);
      const errorMessage = message || t('fetchError');
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      setIsFetching(false);
      isFirstLoad.current = false;
    }
    // JSON serialization keeps object arguments from retriggering requests on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiFunction, JSON.stringify(args), t]);

  useEffect(() => {
    void execute();
  }, [execute]);

  return { data, isLoading, isFetching, error, refetch: execute };
}

export function useApiAction<T extends ApiFunction>(
  apiFunction: T,
  options: ActionOptions = {},
) {
  type Data = ResponseData<Awaited<ReturnType<T>>>;

  const {
    showSuccessToast = true,
    showErrorToast = true,
    successMsg,
  } = options;
  const [data, setData] = useState<Data | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ValidationErrors | null>(null);
  const t = useTranslations('common');

  const execute = async (...args: Parameters<T>) => {
    setIsLoading(true);
    setError(null);

    try {
      const request = apiFunction as unknown as (...requestArgs: Parameters<T>) => ReturnType<T>;
      const response = await request(...args);
      const responseData = unwrapResponse(response) as Data;
      setData(responseData);

      if (showSuccessToast) {
        const responseMessage = typeof responseData === 'object' && responseData !== null && 'message' in responseData
          ? responseData.message
          : undefined;
        toast.success(successMsg || (typeof responseMessage === 'string' ? responseMessage : undefined) || t('operationSuccessful'));
      }

      return { success: true as const, data: responseData };
    } catch (requestError: unknown) {
      const { errors, messages, message } = readApiError(requestError);
      const errorMessage = message || t('unexpectedError');
      setError(errors);

      if (showErrorToast) {
        if (messages.length > 0) {
          messages.forEach((item) => toast.error(item));
        } else {
          toast.error(errorMessage);
        }
      }

      return { success: false as const, error: errors, message: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return { execute, data, isLoading, error };
}
