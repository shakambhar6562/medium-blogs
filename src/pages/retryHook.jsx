import { useCallback, useEffect } from "react";
import { withRetry } from "../utility/withRetry";
import { defaultClient } from "../MockClient/MockClient";

function RetryHookPage() {
  const callApi = useCallback(
    // eslint-disable-next-line react-hooks/use-memo
    withRetry({
      callBackFn: (signal) => {
        return defaultClient.GET({
          mockEndpoint: defaultClient.availableEnpoints.productList,
          sleepTimer: 2000,
          signal,
        });
      },
      retries: 3,
      onretryQueueFailed: (err) => {
        console.log("we failed to retry the queue", err);
      },
      onSuccess: (data) => {
        console.log("Success", data);
      },
    }),
    [],
  );

  useEffect(() => {
    callApi();
  }, []);

  return <div></div>;
}

export default RetryHookPage;
