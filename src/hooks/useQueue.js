import React, { useCallback, useEffect, useRef, useState } from "react";
import { checkIfRequestWasAborted } from "../utility/checkIfRquestWasAborted";

const useQueue = ({
  processQueueOnMount = false,
  queue = [],
  handlers = {
    onQueueStart: () => {},
    onQueueError: () => {},
    onQueueComplete: () => {},
    onQueueItemComplete: () => {},
    onQueueItemError: () => {},
  },
  queueDataMapper = [],
  defaultValue = null,
  defaultParams = null,
}) => {
  const [queueState,setQueueState] = useState(defaultValue);
  const [queueItems] = useState([...queue]);
  const abortControllerRef = useRef({});

  const cancelQueue = useCallback(() => {
    const signalsRunning = Object.values(abortControllerRef.current);
    signalsRunning.forEach((signal) => signal.abort("The queue was cancelled"));
  }, []);

  const queueHandler = useCallback(async () => {
    let i;
    let previousData = [];
    let isCancelled = false;
    try {
      for (i = 0; i < queueItems.length; i++) {
        try {
          if (i === 0) {
            handlers?.onQueueStart?.();
          }
          abortControllerRef.current[i] = new AbortController();
          const signal = abortControllerRef.current[i].signal;
          const { data } = await queueItems[i](signal, [...previousData]);
          const mappedFinalData =
            queueDataMapper?.[i] && typeof queueDataMapper[i] === "function"
              ? queueDataMapper[i](data)
              : data;
          previousData.push(mappedFinalData);
          handlers?.onQueueItemComplete?.(mappedFinalData);
        } catch (error) {
          handlers?.onQueueItemError?.(error);
          if (checkIfRequestWasAborted(error)) {
            isCancelled = true;
            throw new Error("Queue was cancelled");
          } else {
            previousData.push({
              data: null,
              error: error,
              isAbortErr: false,
            });
          }
        }
      }
    } catch (error) {
      handlers?.onQueueError?.(error);
    }

    if (!isCancelled) {
      setQueueState(previousData);
      handlers?.onQueueComplete?.(previousData);
    }
  }, []);

  useEffect(() => {
    if (processQueueOnMount) {
      const params = defaultParams ? [defaultParams] : [];
      queueHandler(...params);
    }
  }, [processQueueOnMount]);

  return {
    queueState,
    queueHandler,
    cancelQueue,
  };
};

export default useQueue;
