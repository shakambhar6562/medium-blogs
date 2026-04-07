import { useEffect } from "react";
import { usePromise } from "./usePromise";

const useRetry = ({
  defaultValue = null,
  executeOnMount = false,
  defaultError = null,
  execute = async () => {}, // expected values from the,
  abortReasonDefault = "this request was cancelled",
  retryableStatusCodes = [500, 503, 504],
  retryDelayInterval = 1,
  jitter = 2,
  retries = 3,
  promiseExecutionStatusHandlers = {
    onSuccess: () => {},
    onError: () => {},
    onComplete: () => {},
    isRequestAbortionComplete: () => {},
    isRetryExhausted: () => {},
    isRetrySuccessFull: () => {},
  },
  dataMapper = (data) => data,
}) => {
  const { currentState, cancelRequest, callApi, resetState, updateState } =
    usePromise({
      defaultValue,
      execute,
      executeOnMount: false,
      abortReasonDefault,
      dataMapper,
      defaultError,
      promiseExecutionStatusHandlers,
    });

  const retryHandler = async (...args) => {
    let i;
    let finalData = null;
    try {
      for (i = 0; i < retries; i++) {
        const response = await callApi(...args);
        console.log("response", response);
        if (response?.isAbortErr) {
          throw new Error("The execution was stopped midway");
        }
        if (retryableStatusCodes.includes(response?.status)) {
          const delayPromise = new Promise((res) =>
            setTimeout(
              () => {
                res(null);
              },
              (Math.pow(jitter, i) + retryDelayInterval) * 1000,
            ),
          );
          await delayPromise;
        } else {
          finalData = null;
          break;
        }
      }
      if (i === retries) {
        promiseExecutionStatusHandlers?.isRetryExhausted?.();
      } else {
        promiseExecutionStatusHandlers?.isRetrySuccessFull?.(finalData);
      }
    } catch (error) {
      console.log("There was a error while retry processing", error);
    }
  };

  useEffect(() => {
    if (!executeOnMount) return;
    retryHandler();
  }, [executeOnMount]);

  return {
    retryHandler,
    currentState,
    cancelRequest,
    resetState,
    updateState,
  };
};

export default useRetry;
