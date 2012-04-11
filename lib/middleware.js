var fs = require('fs');
var watch = require('./watch');
var debug = require('debug')('stalk:middleware');

module.exports = function(dirs, options) {

  var currentResponse = null;

  watch(dirs, options, function(files) {
    debug('changed');
    if (currentResponse) {
      try {
        currentResponse.send(files.join(','));
      } catch(e) {
        console.error('error sending response to browser, try manually refreshing the browser');
      }
    }
  });

  return function(req, res, next) {
    if (req.url.match(/\/stalk.js/)) {
      res.header('Content-Type', 'application/javascript');
      fs.readFile(__dirname+'/browser-client.js', 'utf8', function(err, str) {
        res.end(str);
      });
    } else if (req.url.match(/\/stalk\//)) {
      debug('connected with browser');
      currentResponse = res;
    } else {
      next();
    }
  };


};
