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
  base: "/trill/",
  server: {
    proxy: {
      "/api/lastfm": {
        target: "https://ws.audioscrobbler.com/2.0",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/lastfm/, ""),
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            // console.log("proxy error", err);
          });
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            const apiKey = process.env.LAST_FM_API_KEY; // Replace with your actual API key
            proxyReq.path += `&api_key=${apiKey}`;

            // console.log("Sending Request to the Target:", req.method, req.url);
          });
          proxy.on("proxyRes", (proxyRes, req, _res) => {
            // console.log(
            //   "Received Response from the Target:",
            //   proxyRes.statusCode,
            //   req.url
            // );
          });
        },
      },
      "/api/musicbrainz": {
        target: "http://musicbrainz.org/ws/2",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/musicbrainz/, ""),
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            // console.log("proxy error", err);
          });
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            // console.log("Sending Request to the Target:", req.method, req.url);
          });
          proxy.on("proxyRes", (proxyRes, req, _res) => {
            // console.log(
            //   "Received Response from the Target:",
            //   proxyRes.statusCode,
            //   req.url
            // );
          });
        },
      },
      "/api/discogs/oauth/request_token": {
        target: "https://api.discogs.com/oauth/request_token",
        changeOrigin: true,
        rewrite: (path) => "",
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            // console.log("proxy error", err);
          });
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            // Rewrite needs to return empty string so the full url can be used

            proxyReq.setHeader(
              "Content-Type",
              "application/x-www-form-urlencoded",
            );
            proxyReq.setHeader("User-Agent", "Trill/1.0.0");
            proxyReq.setHeader(
              "Authorization",
              `OAuth oauth_consumer_key="${process.env.DISCOGS_CONSUMER_KEY}", oauth_nonce="${generateRandomString()}", oauth_signature="${process.env.DISCOGS_CONSUMER_SECRET}&", oauth_signature_method="PLAINTEXT", oauth_timestamp="${generateOAuthTimestamp()}", oauth_callback=${process.env.SITE_URL + "/discogs/callback"}`,
            );

            // console.log(
            //   "Sending Request to the Target auth:",
            //   req.method,
            //   req.url
            // );
          });
          proxy.on("proxyRes", (proxyRes, req, _res) => {
            // console.log(
            //   "Received Response from the Target:",
            //   proxyRes.statusCode,
            //   req.statusMessage,
            //   _res.statusMessage,
            //   _res.statusCode
            // );
          });
        },
      },
      "/api/discogs/oauth/access_token": {
        target: "https://api.discogs.com/oauth/access_token",
        changeOrigin: true,
        rewrite: (path) => "",
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            // console.log("proxy error", err);
          });
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            proxyReq.setHeader(
              "Content-Type",
              "application/x-www-form-urlencoded",
            );
            proxyReq.setHeader("User-Agent", "Trill/1.0.0");

            // Added rest of auth headers from .env
            let auth = proxyReq.getHeader("Authorization")?.toString();
            auth += `, oauth_consumer_key="${process.env.DISCOGS_CONSUMER_KEY}", oauth_nonce="${generateRandomString()}", oauth_signature_method="PLAINTEXT", oauth_timestamp="${generateOAuthTimestamp()}"`;
            auth = auth.replace(
              'oauth_signature="&',
              `oauth_signature="${process.env.DISCOGS_CONSUMER_SECRET}&`,
            );
            proxyReq.setHeader("Authorization", auth);
            // console.log("Sending Request to the Target:", req.method, req.url);
          });
          proxy.on("proxyRes", (proxyRes, req, _res) => {
            // console.log(
            //   "Received Response from the Target:",
            //   proxyRes.statusCode,
            //   req
            // );
          });
        },
      },
      "/api/discogs/image": {
        target: "https://i.discogs.com",
        changeOrigin: true,
        rewrite: (path) =>
          path.replace("/api/discogs/image", "https://i.discogs.com"),
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            // console.log("proxy error", err);
          });
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            console.log("Sending Request to the Target:", req.method, req.url);
            // getCurl(proxyReq);
          });
          proxy.on("proxyRes", (proxyRes, req, _res) => {
            // console.log(
            //   "Received Response from the Target:",
            //   proxyRes.statusCode,
            //   req
            // );
          });
        },
      },
      "/api/discogs": {
        target: "https://api.discogs.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/discogs/, ""),
        configure: (proxy, _options) => {
          proxy.on("error", (err, _req, _res) => {
            // console.log("proxy error", err);
          });
          proxy.on("proxyReq", (proxyReq, req, _res) => {
            proxyReq.setHeader(
              "Content-Type",
              "application/x-www-form-urlencoded",
            );
            proxyReq.setHeader("User-Agent", "Trill/1.0.0");

            // Added rest of auth headers from .env
            let auth = proxyReq.getHeader("Authorization")?.toString();
            auth += `, oauth_consumer_key="${process.env.DISCOGS_CONSUMER_KEY}", oauth_nonce="${generateRandomString()}", oauth_signature_method="PLAINTEXT", oauth_timestamp="${generateOAuthTimestamp()}"`;
            auth = auth.replace(
              'oauth_signature="&',
              `oauth_signature="${process.env.DISCOGS_CONSUMER_SECRET}&`,
            );
            proxyReq.setHeader("Authorization", auth);

            // console.log("Sending Request to the Target:", req.method, req.url);

            // getCurl(proxyReq);
          });
          proxy.on("proxyRes", (proxyRes, req, _res) => {
            // console.log(
            //   "Received Response from the Target:",
            //   proxyRes.statusCode,
            //   req
            // );
          });
        },
      },
    },
  },
  plugins: plugins,
});
