#!/usr/bin/env node

var program = require('commander');
var watch = require('../lib/watch');
var exec = require('child_process').exec;
var fs = require('fs');


var list = function(val) {
  return val.split(',');
};

program
  .version(JSON.parse(fs.readFileSync(__dirname + '/../package.json', 'utf8')).version)
  .option('-p, --path <path>', 'Path to watch [defaults to cwd]', process.cwd())
  .option('-i, --ignore <path>', 'Paths to ignore [path1,path2]', list)
  .usage('[cmd]')
  .parse(process.argv);

if (program.args.length !== 0) {
  var prog = program.args.join(' ');
 
  console.log('Watching: '+program.path);
  console.log('Command: '+prog);
  watch(program.path, { ignore: program.ignore || [] }, function() {
    exec(prog, function(error, stdout, stderr) {
      if (error)
        throw error;
      if (stdout)
        console.log(stdout);
      if (stderr)
        console.log(stderr);
    });
  });
} else {
  process.stdout.write(program.helpInformation());
  program.emit('--help');
  process.exit(1);
}
