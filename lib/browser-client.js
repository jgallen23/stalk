!function() {
  /** XHConn - Simple XMLHTTP Interface - bfults@gmail.com - 2005-04-08        **
   ** Code licensed under Creative Commons Attribution-ShareAlike License      **
   ** http://creativecommons.org/licenses/by-sa/2.0/                           **/
  function XHConn() {
    var xmlhttp, bComplete = false;
    try { xmlhttp = new ActiveXObject("Msxml2.XMLHTTP"); }
    catch (e) { try { xmlhttp = new ActiveXObject("Microsoft.XMLHTTP"); }
    catch (e) { try { xmlhttp = new XMLHttpRequest(); }
    catch (e) { xmlhttp = false; }}}
    if (!xmlhttp) return null;
    this.xmlhttp = xmlhttp;
    this.connect = function(sURL, fnDone)
    {
      if (!xmlhttp) return false;
      bComplete = false;

      xmlhttp.open('GET', sURL, true);
      xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && !bComplete) {
          bComplete = true;
          fnDone(xmlhttp);
        }
      };
      xmlhttp.send();
      return xmlhttp;
    };
    return this;
  }

  var stylesheetExt = ['css', 'styl', 'less'];

  var refreshStylesheet = function(url, node) {
    var timestamp = new Date().getTime();
    var link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', url + '?t=' + timestamp);
    var head = document.getElementsByTagName('head')[0];
    head.insertBefore(link, node.nextSibling);
    console.log('Refreshing: '+url);
    setTimeout(function() {
      document.getElementsByTagName('head')[0].removeChild(node);
    }, 100);
  };

  var refreshStylesheets = function(files) {
    var cssNodes = document.getElementsByTagName('link');
    for (var i = 0, c = cssNodes.length; i < c; i++) {
      var node = cssNodes[i];
      var path = node.getAttribute('href').split('?')[0];
      for (var a = 0, b = files.length; a < b; a++) {
        var file = files[a];
        if (window._stalkRefreshAll || path.match(file)) {
          refreshStylesheet(path, node);
        }
      }
    }
    
  };

  var getExtention = function(file) {
    var s = file.split('.');
    return s[s.length-1];
  };

  var refresh = function(files) {
    var needsRefresh = false;
    var stylesheets = [];
    for (var i = 0, c = files.length; i < c; i++) {
      var file = files[i];
      var extension = getExtention(file);
      if (stylesheetExt.indexOf(extension) == -1) {
        needsRefresh = true;
      } else {
        stylesheets.push(file);
      }
    }

    if (needsRefresh) {
      window.location.reload();
    } else {
      refreshStylesheets(stylesheets);
    }
  };

  var timeout;
  var connect = function() {
    var conn = new XHConn();
    conn.connect('/stalk/', function(req) {
      //console.log(req);
      if (req.status === 200) {
        var files = req.responseText.split(',');
        refresh(files);
        connect();
      }
    });
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(function() {
      conn.xmlhttp.abort();
      setTimeout(function() {
        connect();
      }, 100);
    }, 1000 * 30);
  };
  connect();
}();
