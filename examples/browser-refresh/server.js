var express = require('express');
var stalk = require('../../');

var port = 8001;
var app = express.createServer();

app.use(stalk.middleware([__dirname+'/public', __dirname+'/views']));

app.set('views', __dirname+'/views');
app.get('/', function(req, res){
  res.render('index.jade', { layout: false });
});

console.log("Server started on port "+port);
app.listen(port);
