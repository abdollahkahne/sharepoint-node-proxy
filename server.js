var express = require("express");
var modifyResponse = require("http-proxy-response-rewrite");
var Agent = require("agentkeepalive");
var httpProxy = require("http-proxy");

//if you use basic auth mode you can delete agent from here and from middleware
var agent = new Agent({
  maxSockets: 100,
  keepAlive: true,
  maxFreeSockets: 10,
  keepAliveMsecs: 1000,
  timeout: 6000,
  keepAliveTimeout: 1000, // free socket keepalive for 30 seconds
  freeSocketTimeout: 1000,
});

var app = express();
var apiProxy = httpProxy.createProxyServer();

//remove origin and Referrer to prevent forbidden response (403 error)
apiProxy.on("proxyReq", function (proxyReq, req, res, options) {
  //This condition added for more security
  if (req.headers.origin && req.headers.origin.startsWith("http://localhost:3000")) {
  proxyReq.removeHeader("Origin");
  proxyReq.removeHeader("Referrer");
  }
});

//add cors-related headers!

apiProxy.on("proxyRes", function (proxyRes, req, res) {
// image are simple request so they are not prevented by CORS Policy by default so make an exception for them
  if (req.headers.accept.indexOf("image") > -1) {
  } else {
    modifyResponse(res, proxyRes.headers["content-encoding"], function (body) {
      res.setHeader("custom-header", "Powered By Express!");
      res.setHeader("access-control-allow-origin", "http://localhost:3000");
      return body;
    });
  }
});

var serverOne = "http://sharepoint";

app.all("/*", function (req, res, next) {
  // if you use Basic Auth mode you may delete agent property
  apiProxy.web(req, res, { target: serverOne, agent: agent }, function (err) {
    console.log(err);
  });
});

app.listen(3020);
