import MillionLint from "@million/lint";
import react from "@vitejs/plugin-react-swc";
import "dotenv/config";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
var plugins = [react()];
plugins.unshift(MillionLint.vite());
export default defineConfig({
  plugins: plugins,
});
