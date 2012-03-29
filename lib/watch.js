var fs = require('fs');
var aug = require('aug');
var debug = require('debug')('stalk');
var path = require('path');


var defaults = {
};

var defaultIgnore = ['.git'];

var watch = function(dir, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  options = aug(true, {}, defaults, options);
  options.ignore = options.ignore.concat(defaultIgnore);
  var timeout;

  if (options.ignore.length !== 0)
    debug('ignoring %s', options.ignore.join(','));

  var trigger = function() {
    if (timeout)
      clearTimeout(timeout);

    timeout = setTimeout(function() {
      debug('trigger');

      callback();
    }, 100);
  };

  
  var watchDir = function(dir) {

    debug('watching %s', dir);
    fs.readdir(dir, function(err, files) {
      if (err) throw err;
      var parent = dir;
      files.forEach(function(file) {
        var filepath = path.join(parent, file);

        for (var i = 0, c = options.ignore.length; i < c; i++) {
          var ignore = options.ignore[i];
          if (filepath.match(ignore))
            return;
        }

        fs.stat(filepath, function(err, stat) {
          if (err) throw err;
          if (stat.isDirectory()) {
            watchDir(filepath, options, trigger);
          }
        });
      });

    });
    try {
      fs.watch(dir, function() {
        trigger();
      });
    } catch(e) {
      debug('error %s', e);
    }
  };
  path.exists(dir, function(exists) {
    if (exists)
      watchDir(dir);
    else
      throw new Error(dir + ' doesn\'t exist');
  });
};

module.exports = watch;

