!function() {
  /** XHConn - Simple XMLHTTP Interface - bfults@gmail.com - 2005-04-08        **
   ** Code licensed under Creative Commons Attribution-ShareAlike License      **
   ** http://creativecommons.org/licenses/by-sa/2.0/                           **/
  function XHConn()
  {
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

  var connect = function() {
    var conn = new XHConn();
    conn.connect('/stalk/', function(req) {
      if (req.status === 200)
        window.location.reload();
    });
    setTimeout(function() {
      conn.xmlhttp.abort();
      connect();
    }, 1000 * 20);
  };
  connect();
}();
