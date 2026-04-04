import { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';
import { defaultClient } from './MockClient/MockClient';
import { withRetry } from './utility/withRetry';

function App() {
  const callApi = useCallback(
    withRetry({
      callBackFn: (signal, ...args) => {
        return defaultClient.GET({
          mockEndpoint: defaultClient.availableEnpoints.productList,
          sleepTimer: 2000,
          signal,
        });
      },
      retries: 3,
      onretryQueueFailed: (err) => {
        console.log('we failed to retry the queue', err);
      },
      onSuccess: (data) => {
        console.log('Success', data);
      },
    }),
    []
  );

  useEffect(() => {
    callApi();
  }, []);

  return <div></div>;
}

export default App;
