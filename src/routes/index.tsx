import { createFileRoute } from "@tanstack/react-router";
import { setSiteTitle } from "../components/functions/Functions";
import StartPage from "../components/start-page/StartPage";

export const Route = createFileRoute("/")({
  component: StartPageComponent,
});

function StartPageComponent() {
  setSiteTitle();

  return <StartPage />;
}
