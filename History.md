
0.1.0 / 2012-04-11 
==================

  * Merge branch 'feature/browser-refresh'
  * use process.stdout.write instead of console.log
  * add cache buster on updated css
  * if stylesheet, don't refresh, just drop that on the page
  * Merge branch 'feature/filename-callback' into feature/browser-refresh
  * return files that were changed in callback
  * initial work on browser refresh middleware

0.0.6 / 2012-04-05 
==================

  * --path will now accept multiple,paths
  * added some example scripts
  * switched to use spawn, will kill process if still running when a file changed

0.0.5 / 2012-03-30 
==================

  * don't throw if error, spacer in between running cmd

0.0.4 / 2012-03-29
==================

  * fixed default ignore, try catch around watch

0.0.3 / 2012-03-29
==================

  * join args, print out whats being watched and what command will be run
  * ignore .git by default

0.0.2 / 2012-03-29
==================

  * fixed bin/main

0.0.1 / 2012-03-29
==================

  * initial commit
