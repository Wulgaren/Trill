import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import Navbar from "./components/navbar/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <main className="p-5">
        <Outlet />
      </main>

      <div className="fixed bottom-0 z-[-1] h-full w-full overflow-hidden">
        <div className="blob"></div>
        <div className="blob"></div>
      </div>

      <ReactQueryDevtools />
      <TanStackRouterDevtools position="bottom-right" />
    </>
  );
}

export default App;
