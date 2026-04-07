import { useCallback, useEffect } from "react";
import { withRetry } from "../utility/withRetry";
import { defaultClient } from "../MockClient/MockClient";
import useRetry from "../hooks/useRetryHook";
import axios from "axios";

function RetryHookPage() {
  const { currentState } = useRetry({
    retryableStatusCodes: [400, 500, 502],
    promiseExecutionStatusHandlers: {
      isRetrySuccessFull: () => {
        console.log("The retry was successful");
      },
    },
    execute: async () => {
      return axios.get("/api");
    },
    executeOnMount: true,
  });

  console.log("currentStatecurrentState", currentState);

  return <div>Retry hook page</div>;
}

export default RetryHookPage;
