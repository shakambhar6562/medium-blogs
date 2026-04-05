import axios from "axios";
import { usePromise } from "../hooks/usePromise";

const PromisePage = () => {
  const { currentState } = usePromise({
    abortReasonDefault: "this request was cancelled",
    dataMapper: (data) => data?.data?.products || [],
    defaultValue: [],
    executeOnMount: true,
    execute: async (signal) => {
      return axios.get("https://dummyjson.com/products?delay=1000", { signal });
    },
    promiseExecutionStatusHandlers: {
      isRequestAbortionComplete: () => {
        console.log("Aborting complete");
      },
    },
  });
  const { data } = currentState;

  if (currentState?.isPending) {
    return <div>This is loading....</div>;
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        marginTop: "10px",
      }}
    >
      {data?.map(({ title, id }) => (
        <div
          style={{ background: "white", width: "100%", color: "black" }}
          key={id}
        >
          {title}
        </div>
      ))}
    </div>
  );
};

export default PromisePage;
