var fs = require('fs');
var aug = require('aug');
var debug = require('debug')('stalk');
var path = require('path');


var defaults = {
  ignore: []
};

var defaultIgnore = ['.git', '^4913$', '~$'];

var watch = function(rootDirs, options, callback) {
  if (typeof rootDirs === 'string') 
    rootDirs = [rootDirs];

  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  options = aug(true, {}, defaults, options);
  options.ignore = options.ignore.concat(defaultIgnore);
  var timeout;

  if (options.ignore.length !== 0)
    debug('ignoring %s', options.ignore.join(','));

  var changedFiles = [];
  var trigger = function(file) {
    if (changedFiles.indexOf(file) == -1)
      changedFiles.push(file);
    if (timeout)
      clearTimeout(timeout);

    timeout = setTimeout(function() {
      debug('trigger');

      callback(changedFiles);
      changedFiles = [];
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
      fs.watch(dir, { persistant: false }, function(event, filename) {
        for (var i = 0, c = options.ignore.length; i < c; i++) {
          var ignore = options.ignore[i];
          if (filename && filename.match(ignore)) {
            return;
          }
        }
        trigger(filename);
      });
    } catch(e) {
      debug('error %s', e);
      if (e.message == 'watch EMFILE') {
        console.error('Error: OS maxed out on watchers, '+dir+' will not be watched');
      }
    }
  };
  rootDirs.forEach(function(dir) {
    fs.exists(dir, function(exists) {
      if (exists)
        watchDir(dir);
      else
        throw new Error(dir + ' doesn\'t exist');
    });
  });
};

module.exports = watch;

