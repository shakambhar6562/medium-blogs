import React, { useEffect } from "react";
import { usePromise } from "../hooks/usePromise";
import axios from "axios";

const PreflightPage = () => {
  const { currentState: dependentState } = usePromise({
    executeOnMount: true,
    dataMapper: (data) => data?.data || [],
    execute: async (signal) => {
      return axios.get("/api/preflightcheck/dependent", { signal });
    },
  });

  const { currentState, callApi } = usePromise({
    execute: async (signal) => {
      return axios.get("/api/preflightcheck", { signal });
    },
    preflightDependencies: {
      dependentData: dependentState.data,
    },
    preflightChecks: [
      (data) => {
        console.log("checkData", data);
        if (data?.dependentData?.length > 0 && data?.dependentData?.[0]?.id === 1) {
          return true;
        }
        return false;
      },
    ],
  });

  useEffect(() => {
    if (!dependentState.isPending) {
      callApi();
    }
  }, [dependentState.isPending]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw",
      }}
    >
      <div>Preflight Page</div>
    </div>
  );
};

export default PreflightPage;
