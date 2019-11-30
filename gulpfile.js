
const {gulp, dest} = require('gulp');
const connect = require('gulp-connect');
const exec = require('child_process').exec;


function server(cb) {
  connect.server({
    port: 3000
  })
  return exec("npm start", function (err, stdout, stderr) {
    console.log(err)
    cb(err);
  });
}

function defaultTask(cb) {
  server(cb)
  cb();
}

function deploy(cb) {
    return exec('zsh bin/deploy.sh', function (err, stdout, stderr) {
      cb(err);
    });
}

exports.default = defaultTask
exports.deploy = deploy
