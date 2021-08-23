module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      ts: {
          default: {
              tsconfig: './tsconfig.json'
          }
      },
      watch: {
          default: {
              files: ["src/ts/**/*", "src/d.ts/**/*", "index.html", "index.css", "i.bmp"],
              tasks: ['ts:default'],
              options: {
                  livereload: true
              }
          }
      },
      connect: {
          server: {
              options: {
                  livereload: true
              }
          }
      },
      clean: {
          all: ["build", "dist", "dist.zip", "js13k.zip"]
      },
      'closure-compiler': {
          es2018: {
              closurePath: 'libbuild/closure-compiler-v20210601',
              js: 'build/out.js',
              jsOutputFile: 'dist/out.min.js',
              maxBuffer: 500,
              reportFile: 'closure.txt',
              options: {
                  compilation_level: 'ADVANCED_OPTIMIZATIONS',
                  language_in: 'ECMASCRIPT_2018',
                  language_out: 'ECMASCRIPT_2018',
                  externs: 'src/externs/externs.js',
                  create_source_map: "true",
              }
          },
          es5: {
              closurePath: 'libbuild/closure-compiler-v20210601',
              js: 'build/out.js',
              jsOutputFile: 'dist/out.min.js',
              maxBuffer: 500,
              reportFile: 'closure.txt',
              options: {
                  compilation_level: 'ADVANCED_OPTIMIZATIONS',
                  language_in: 'ECMASCRIPT_2018',
                  language_out: 'ECMASCRIPT5',
                  externs: 'src/externs/externs.js'
              }
          }
      },
      cssmin: {
        options: {
        },
        target: {
            files: {
            'dist/index.css': ['dist/index.css']
            }
        }
      },
      htmlmin: {
        dist: {
          options: {
            removeComments: true,
            collapseWhitespace: true
          },
          files: {
            'dist/index.html': 'dist/index.html'
          }
        }
      },
      inline: {
          dist: {
              src: 'dist/index.html',
              dest: 'dist/index.html'
          }
      },
      replace: {
          html: {
              src: ['dist/index.html'],
              overwrite: true,
              replacements: [{
                  from: /build\/out\.js/g,
                  to:"out.min.js"
              }, { // gut the HTML entirely!
                  from: "</body></html>",
                  to: ""
              }, {
                  from: "<html>",
                  to: ""
              }, {
                  from: "<body>",
                  to: ""
              }]
          },
          js: {
              src: ['dist/out.min.js'],
              overwrite: true,
              replacements: [{
                  from: "'use strict';",
                  to:""
              }, {
                  from: "void 0",
                  to: "null"
              }, {
                  from: "const ",
                  to: "var "
              }, {
                from: "let ",
                to: "var "
              }, {
                //from: /\[(\d+)\]\:/,
                from: /\[(\d+)\]:/g,
                to: "$1:"
              }/*, {
                from: /const (([a-zA-Z_$][a-zA-Z0-9_$]*=Math(\.|\w)*,?)+);/g,
                to: ';with(Math){$1}'
              }, {
                from: /const (([a-zA-Z_$][a-zA-Z0-9_$]*=Math(\.|\w)*,?)+),/g,
                to: ';with(Math){$1};var '
              }*/
              /*, { // turn functions into => form
                from: /(=|:|return |\(|,)function\(([^\)]*)\)/g,
                to:"$1($2)=>"
              }, { // replace all function decls with lets
                from: /function ([^\)]+)(\([^\)]*\))/g,
                to: "let $1=$2=>"
              },*/]
          },
          js2: { // second pass for the bits that we changed above
            src: ['dist/out.min.js'],
            overwrite: true,
            replacements: [/*{// fix up all the missing semicolons from the previous function replacement
                from: /\}(let |for\(|\(|[^;= \(,\}]+=)/g,
                to: "};$1"
            }, { // compress sequential var decls
                from: /(let ([a-zA-Z_$][a-zA-Z0-9_$]*(=([^,\[\}\(;]+|\[[^\]]*\]))*,?)*);let /g,
                to: "$1,"
            }*/ /*{ // should all be contained in a with block
                from: /Math\./g,
                to: ""
            }*/]
        },
      },
      copy: {
          html: {
              files: [
                  {expand: true, src: ['i.bmp'], dest: 'dist/'},
                  {expand: true, src: ['index.html'], dest: 'dist/'},
                  {expand: true, src: ['index.css'], dest: 'dist/'}
              ]
          }
      },
      devUpdate: {
          main: {
              options: {
                  //task options go here
                  updateType: 'force',
                  reportUpdated: true
              }
          }
      }
  });

  // clean
  grunt.loadNpmTasks('grunt-contrib-clean');
  // load the plugin that provides the closure compiler
  grunt.loadNpmTasks('grunt-closure-compiler');
  // Load the plugin that provides the "TS" task.
  grunt.loadNpmTasks('grunt-ts');
  // copy
  grunt.loadNpmTasks('grunt-contrib-copy');
  // replace text in file
  grunt.loadNpmTasks('grunt-text-replace');
  // update version
  grunt.loadNpmTasks('grunt-dev-update');
  // inline js
  grunt.loadNpmTasks('grunt-inline');
  // live reload
  grunt.loadNpmTasks('grunt-contrib-watch');
  // server for live reload
  grunt.loadNpmTasks('grunt-contrib-connect');
  // copying html
  grunt.loadNpmTasks('grunt-contrib-copy');
  // minifying css
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  // minifying html
  grunt.loadNpmTasks('grunt-contrib-htmlmin');

  // Default task(s).
  grunt.registerTask('reset', ['clean:all']);
  grunt.registerTask('prod', ['ts']);
  grunt.registerTask('dist', ['prod', 'closure-compiler:es2018', 'copy','cssmin','replace:html', 'replace:js', 'replace:js2', 'inline', 'htmlmin']);
  grunt.registerTask('default', ['prod', 'connect', 'watch']);

};