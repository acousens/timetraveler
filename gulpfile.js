const {gulp, dest} = require('gulp');
const connect = require('gulp-connect');
const exec = require('child_process').exec;


function server() {
  connect.server({
    port: 3000
  })
}

function defaultTask(cb) {
  // place code for your default task here
  server()
  cb();
}

function deploy(cb) {
    return exec('zsh bin/deploy.sh', function (err, stdout, stderr) {
      cb(err);
    });
}

exports.default = defaultTask
exports.deploy = deploy
