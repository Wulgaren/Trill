import MillionLint from "@million/lint";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import react from "@vitejs/plugin-react-swc";
import "dotenv/config";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), MillionLint.vite(), TanStackRouterVite()],
});
