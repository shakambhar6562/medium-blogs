import { createBrowserRouter } from "react-router";
import PromisePage from "../src/pages/promise";
import RetryHookPage from "../src/pages/retryHook";
const router = createBrowserRouter([
  {
    path: "/",
    Component: RetryHookPage,
  },
  {
    path: "/usepromise",
    Component: PromisePage,
  },
]);

export { router };
