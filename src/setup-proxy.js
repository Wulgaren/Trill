const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/musicbrainz",
    createProxyMiddleware({
      target: "http://musicbrainz.org/ws/2/",
      changeOrigin: true,
      pathRewrite: {
        "^/api": "", // Remove the '/api' prefix when forwarding the request
      },
    }),
  );
};
