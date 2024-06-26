import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import react from "@vitejs/plugin-react-swc";
import "dotenv/config";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // million.vite({ auto: true }),
    // MillionLint.vite(),
    react(),
    TanStackRouterVite(),
  ],
});
