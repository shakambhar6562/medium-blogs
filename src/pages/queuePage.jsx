import axios from "axios";
import useQueue from "../hooks/useQueue";
import { useEffect } from "react";

const QueuePage = () => {
  const { queueState, cancelQueue } = useQueue({
    defaultValue: [],
    processQueueOnMount: true,
    handlers: {
      onQueueComplete: (data) => {
        console.log("onQueueComplete", data);
      },
    },
    queue: [
      async (signal, previousData) => {
        console.log("previousData -- 1", previousData);
        return axios.get("/api/queue/1", { signal });
      },
      async (signal, previousData) => {
        console.log("previousData -- 2", previousData);
        return axios.get("/api/queue/2", { signal });
      },
      async (signal, previousData) => {
        console.log("previousData -- 3", previousData);
        return axios.get("/api/queue/3", { signal });
      },
    ],
  });

  useEffect(() => {
    let id = setTimeout(() => {
      cancelQueue();
    }, 3000);

    return () => clearTimeout(id);
  }, []);

  return <div>Queue Page</div>;
};

export default QueuePage;
