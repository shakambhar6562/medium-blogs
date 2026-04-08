import { useEffect } from "react";
import useRetry from "../hooks/useRetryHook";
import axios from "axios";

function RetryHookPage() {
  const { currentState, cancelRequest } = useRetry({
    retryableStatusCodes: [400, 500, 502],
    promiseExecutionStatusHandlers: {
      isRetrySuccessFull: () => {
        console.log("The retry was successful");
      },
    },
    execute: async (signal, idx) => {
      console.log("signal", signal, idx);
      return axios.get("/api", { signal });
    },
    executeOnMount: true,
  });

  useEffect(() => {
    let id = setTimeout(() => {
      cancelRequest();
    }, 3000);

    return () => clearTimeout(id);
  }, []);

  return <div>Retry hook page</div>;
}

export default RetryHookPage;
