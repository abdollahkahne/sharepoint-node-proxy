var express = require("express");
// var cors = require("cors");
var modifyResponse = require("http-proxy-response-rewrite");
var Agent = require("agentkeepalive");
var httpProxy = require("http-proxy");

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
apiProxy.on("proxyReq", function (proxyReq, req, res, options) {
  proxyReq.removeHeader("Origin");
  proxyReq.removeHeader("Referrer");
});

apiProxy.on("proxyRes", function (proxyRes, req, res) {
  // ntlm
  // var key = "www-authenticate";
  // proxyRes.headers[key] =
  //   proxyRes.headers[key] && proxyRes.headers[key].split(",");
  // end ntlm

  if (req.headers.accept.indexOf("image") > -1) {
  } else {
    modifyResponse(res, proxyRes.headers["content-encoding"], function (body) {
      // console.log(body);

      res.setHeader("custom-header", "Powered By Microsoft!");
      res.setHeader("access-control-allow-origin", "http://localhost:3000");
      return body;
    });
  }
});

var serverOne = "http://shpweb";

var corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};

app.all("/*", function (req, res, next) {
  apiProxy.web(req, res, { target: serverOne, agent: agent }, function (err) {
    console.log(err);
  });
});

app.listen(3020);
