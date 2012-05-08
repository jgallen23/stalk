#!/usr/bin/env node

var program = require('commander');
var watch = require('../lib/watch');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var fs = require('fs');


var list = function(val) {
  return val.split(',');
};

program
  .version(JSON.parse(fs.readFileSync(__dirname + '/../package.json', 'utf8')).version)
  .option('-p, --path <path>', 'Paths to watch (defaults to cwd) [path1,path2]', process.cwd())
  .option('-i, --ignore <path>', 'Paths to ignore [path1,path2]', list)
  .usage('<cmd>')
  .parse(process.argv);

program.path = list(program.path);

var isRunning = false;
var cmd;

var run = function(app, args) {
  if (isRunning) {
    cmd.kill('SIGHUP');
  }
  cmd = spawn(app, args);
  isRunning = true;

  cmd.stdout.on('data', function(data) {
    process.stdout.write(data.toString());
  });
  cmd.stderr.on('data', function(data) {
    process.stderr.write(data.toString());
  });
  cmd.on('exit', function() {
  });
  console.log("------------------------------------------");
};

if (program.args.length !== 0) {
  var app = 'sh';
  var prog = program.args.join(' ');
  var args = ['-c', prog];
 
  console.log('Watching: '+program.path);
  console.log('Command: '+prog);
  watch(program.path, { ignore: program.ignore || [] }, function(files) {
    console.log('');
    console.log('Files Changed: '+files.join(','));
    run(app, args);
  });
  run(app, args);
} else {
  process.stdout.write(program.helpInformation());
  program.emit('--help');
  process.exit(1);
}
