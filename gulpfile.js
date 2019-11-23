const connect = require('gulp-connect');


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

exports.default = defaultTask