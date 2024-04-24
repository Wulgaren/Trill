import MillionLint from "@million/lint";
import react from "@vitejs/plugin-react-swc";
import "dotenv/config";
import { defineConfig } from "vite";
const generateRandomString = () => {
  return Math.random().toString(36).substring(2);
};
const generateOAuthTimestamp = () => {
  return Math.floor(Date.now() / 1000).toString();
};
const getCurl = (proxyReq) => {
  const method = proxyReq.method;
  const target = proxyReq.protocol + "//" + proxyReq.host;
  let url = proxyReq.path;
  if (!url.includes("http")) url = target + url;
  url = `"${url}"`;

  // Format the headers into a string for the curl command
  let headersString = "";
  for (const [key, value] of Object.entries(proxyReq._headers)) {
    headersString += `-H "${key}: ${value.replace(/"/g, '\\"')}" `;
  }

  // Format the information into a curl command
  const curlCommand = `curl -X ${method} ${headersString} ${url}`;
  console.log(curlCommand);
  console.log("\r\n");
};

// https://vitejs.dev/config/
var plugins = [react()];
plugins.unshift(MillionLint.vite());
export default defineConfig({
  plugins: plugins,
});
