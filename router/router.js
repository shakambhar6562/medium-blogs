import { createBrowserRouter } from "react-router";
import PromisePage from "../src/pages/promise";
import RetryHookPage from "../src/pages/retryHook";
import QueuePage from "../src/pages/queuePage";
import PreflightPage from "../src/pages/preflightPage";
const router = createBrowserRouter([
  {
    path: "/",
    Component: RetryHookPage,
  },
  {
    path: "/usepromise",
    Component: PromisePage,
  },
  {
    path: "/usequeue",
    Component: QueuePage,
  },

  {
    path: "/preflightguard",
    Component: PreflightPage,
  },
  
]);

export { router };
