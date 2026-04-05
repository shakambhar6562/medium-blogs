import { createBrowserRouter } from "react-router";
import App from "../src/App";
import PromisePage from "../src/pages/promise";
const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
  },
  {
    path: "/usepromise",
    Component: PromisePage,
  },
]);

export { router };
