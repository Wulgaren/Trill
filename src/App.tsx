import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Outlet, ScrollRestoration } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import Navbar from "./components/navbar/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <main className="p-3 md:p-5">
        <ScrollRestoration />
        <Outlet />
      </main>

      <div className="fixed bottom-0 z-[-1] h-full w-full overflow-hidden">
        <div className="blob"></div>
        <div className="blob"></div>
      </div>

      <ReactQueryDevtools buttonPosition="bottom-left" />
      <TanStackRouterDevtools position="top-left" />
    </>
  );
}

export default App;
