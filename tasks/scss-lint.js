module.exports = function (grunt) {
  var _ = require('lodash'),
      path = require('path'),
      scsslint = require('./lib/scss-lint').init(grunt);

  grunt.registerMultiTask('scsslint', 'Validate `.scss` files with `scss-lint`.', function() {
    var cwd = process.cwd(),
        done = this.async(),
        files = this.data,
        output = '',
        target = this.target,
        opts;

    opts = this.options({
      config: '.scss-lint.yml',
      reporterOutput: null
    });

    _.forEach(files, function(file, i) {
      if (file.indexOf('/') !== 0) {
        files[i] = cwd + '/' + file;
      }
    });

    grunt.verbose.writeflags(opts, 'scss-lint options');

    grunt.log.writeln('Running scss-lint on ' + target);

    scsslint.lint(files, opts, function (results) {
      var success = results[0] === '';

      if (success) {
        grunt.log.oklns(target + ' files are lint free');
      } else {
        _.forEach(results, function(result) {
          grunt.log.writeln(result);
        });
      }

      if (opts.reporterOutput) {
        grunt.log.writeln('Results have been written to: ' + opts.reporterOutput);
      }

      done(success);
    });
  });
};