var fs = require('fs');
var watch = require('./watch');
var debug = require('debug')('stalk:middleware');

module.exports = function(dirs, options) {
  if (!options) options = {};

  var currentResponse = null;
  var timeout = null;

  watch(dirs, options, function(files) {
    debug('changed');
    var delay = (options && options.refreshDelay) ? options.refreshDelay : 100;
    if (currentResponse) {
      try {
        if (timeout)
          clearTimeout(timeout);
        timeout = setTimeout(function() {
          currentResponse.end(files.join(','));
        }, delay);
      } catch(e) {
        console.error('error sending response to browser, try manually refreshing the browser');
      }
    }
  });

  return function(req, res, next) {
    if (req.url.match(/\/stalk.js/)) {
      res.setHeader('Content-Type', 'application/javascript');
      fs.readFile(__dirname+'/browser-client.js', 'utf8', function(err, str) {
        if (options && options.refreshAllStylesheets)
          str += ';window._stalkRefreshAll = true;';
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
