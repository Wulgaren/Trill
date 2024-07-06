import { createFileRoute } from "@tanstack/react-router";
import StartPage from "../components/start-page/StartPage";

export const Route = createFileRoute("/")({
  component: () => <StartPage />,
});
