import { createRootRoute } from "@tanstack/react-router";
import App from "../App";
import ErrorResult from "../components/error-result/ErrorResult";

export const Route = createRootRoute({
  component: App,
  errorComponent: ErrorResult,
});
