import react from "@vitejs/plugin-react-swc";
import "dotenv/config";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api/lastfm": {
        target: "https://ws.audioscrobbler.com/2.0",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/lastfm/, ""),
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            console.log("proxy error", err);
          });
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            const apiKey = process.env.LAST_FM_API_KEY; // Replace with your actual API key
            proxyReq.path += `&api_key=${apiKey}`;

            console.log("Sending Request to the Target:", req.method, req.url);
          });
          proxy.on("proxyRes", (proxyRes, req, _res) => {
            console.log(
              "Received Response from the Target:",
              proxyRes.statusCode,
              req.url
            );
          });
        },
      },
      "/api/musicbrainz": {
        target: "http://musicbrainz.org/ws/2",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/musicbrainz/, ""),
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            console.log("proxy error", err);
          });
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            console.log("Sending Request to the Target:", req.method, req.url);
          });
          proxy.on("proxyRes", (proxyRes, req, _res) => {
            console.log(
              "Received Response from the Target:",
              proxyRes.statusCode,
              req.url
            );
          });
        },
      },
    },
  },
  plugins: [react()],
});
