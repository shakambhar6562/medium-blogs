import { useReducer, useEffect, useCallback } from "react";

const STATE_TYPE = {
  DATA: "DATA",
  LOADING: "LOADING",
  ERROR: "ERROR",
  RESET: "RESET",
};

const updatehandler = (prevState, action) => {
  const { type = "", payload = "" } = action || {};

  const currentState = { ...prevState };

  switch (type) {
    case STATE_TYPE.DATA: {
      currentState.data = payload;
      break;
    }
    case STATE_TYPE.LOADING: {
      currentState.isPending = payload;
      break;
    }
    case STATE_TYPE.ERROR: {
      currentState.error = payload;
      break;
    }
    case STATE_TYPE.RESET: {
      return {
        ...payload,
      };
    }
    default: {
      return prevState;
    }
  }
  return currentState;
};

const isAbortErrorType = "CanceledError";

const usePromise = ({
  defaultValue = null,
  executeOnMount = false,
  defaultError = null,
  execute = async () => {}, // expected values from the,
  abortReasonDefault = "this request was cancelled",
  promiseExecutionStatusHandlers = {
    onSuccess: () => {},
    onError: () => {},
    onComplete: () => {},
    isRequestAbortionComplete: () => {},
  },
  dataMapper = (data) => data,
}) => {
  const [currentState, updateState] = useReducer(updatehandler, {
    data: defaultValue || null,
    isPending: executeOnMount,
    error: defaultError || "",
    abortController: new AbortController(),
  });

  const cancelRequest = useCallback(
    (reason = "") => {
      currentState.abortController.abort(reason ?? abortReasonDefault);
    },
    [currentState.abortController, abortReasonDefault],
  );

  const resetState = useCallback(() => {
    updateState({
      type: STATE_TYPE.RESET,
      payload: {
        data: defaultValue || null,
        isPending: executeOnMount,
        error: defaultError || "",
        abortController: new AbortController(),
      },
    });
  }, [defaultValue, executeOnMount, defaultError]);

  const callApi = useCallback(
    async (...args) => {
      if (typeof execute === "function") {
        try {
          updateState({
            type: STATE_TYPE.LOADING,
            payload: true,
          });

          const signal = currentState.abortController.signal;

          const data = await execute(signal, ...args);

          updateState({
            type: STATE_TYPE.DATA,
            payload: dataMapper(data),
          });

          promiseExecutionStatusHandlers?.onSuccess(data);
        } catch (err) {
          console.log("errerr", err?.name);
          updateState({
            type: STATE_TYPE.ERROR,
            payload: err,
          });
          if (err.name === isAbortErrorType) {
            promiseExecutionStatusHandlers?.isRequestAbortionComplete(err);
          } else {
            promiseExecutionStatusHandlers?.onError(err);
          }
        } finally {
          updateState({
            type: STATE_TYPE.LOADING,
            payload: false,
          });
          promiseExecutionStatusHandlers?.onComplete();
        }
      }
      return null;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [defaultValue, executeOnMount],
  );

  useEffect(() => {
    if (executeOnMount) {
      callApi();
    }
  }, [executeOnMount]);

  return {
    currentState,
    updateState,
    cancelRequest,
    callApi,
    resetState,
  };
};

export { usePromise, STATE_TYPE };
