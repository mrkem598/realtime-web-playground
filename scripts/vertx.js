var vertx = require('vertx')

vertx.createHttpServer().requestHandler(function(req) {
  var filename = "app/" + (req.uri() == "/" ? "index.html" : "." + req.uri());
  req.response.sendFile(filename)
}).listen(1990)