const withRetry = ({
  callBackFn,
  retries = 3,
  callIntervalDelay = 0,
  onretryQueueFailed = () => {},
  onSuccess = () => {},
}) => {
  let result = null;
  let propogateError = null;
  return async (...args) => {
    const { signal } = new AbortController();
    let i;

    for (i = 0; i < retries; i++) {
      try {
        result = await callBackFn(signal, i < 2, ...args);
        break;
      } catch (err) {
        propogateError = err;
      }
      if (callIntervalDelay) {
        await new Promise((res) => {
          const timerId = setTimeout(() => {
            clearTimeout(timerId);
            res(null);
          }, callIntervalDelay);
        });
      }
    }

    if (i >= retries) {
      onretryQueueFailed(propogateError || 'Something went wrong...');
    } else if (result) {
      onSuccess(result);
    }
  };
};

export { withRetry };
