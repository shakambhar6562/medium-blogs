import { useReducer, useEffect, useCallback, useRef } from "react";

const STATE_TYPE = {
  DATA: "DATA",
  LOADING: "LOADING",
  ERROR: "ERROR",
  RESET: "RESET",
  SET_MULTIPLE: "SET_MULTIPLE",
};

const updatehandler = (prevState, action) => {
  const { type = "", payload = "" } = action || {};

  const currentState = { ...prevState };

  switch (type) {
    case STATE_TYPE.SET_MULTIPLE: {
      return {
        ...currentState,
        ...payload,
      };
    }
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
  });

  const abortControllerRef = useRef(new AbortController());

  const cancelRequest = useCallback(
    (reason = "") => {
      console.log("abortControllerRef.current", abortControllerRef.current);
      abortControllerRef.current.abort(reason ?? abortReasonDefault);
    },
    [abortReasonDefault],
  );

  const resetState = useCallback(() => {
    updateState({
      type: STATE_TYPE.RESET,
      payload: {
        data: defaultValue || null,
        isPending: executeOnMount,
        error: defaultError || "",
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

          abortControllerRef.current = new AbortController();
          const signal = abortControllerRef.current.signal;

          const response = await execute(signal, ...args);

          updateState({
            type: STATE_TYPE.SET_MULTIPLE,
            payload: {
              data: dataMapper(response),
              error: null,
            },
          });

          promiseExecutionStatusHandlers?.onSuccess?.(response);

          return {
            data: dataMapper(response),
            status: response.status || 200,
          };
        } catch (err) {
          updateState({
            type: STATE_TYPE.SET_MULTIPLE,
            payload: {
              data: defaultValue || null,
              error: err,
            },
          });
          if (err.name === isAbortErrorType) {
            promiseExecutionStatusHandlers?.isRequestAbortionComplete?.(err);
          } else {
            promiseExecutionStatusHandlers?.onError?.(err);
          }
          return {
            data: null,
            status: err?.response?.status || 500,
            isAbortErr: err.name === isAbortErrorType,
          };
        } finally {
          updateState({
            type: STATE_TYPE.LOADING,
            payload: false,
          });
          promiseExecutionStatusHandlers?.onComplete?.();
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
