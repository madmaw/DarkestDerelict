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
          es2020: {
              closurePath: 'libbuild/closure-compiler-v20210601',
              js: 'build/out.js',
              jsOutputFile: 'dist/out.min.js',
              maxBuffer: 500,
              reportFile: 'closure.txt',
              options: {
                  compilation_level: 'ADVANCED_OPTIMIZATIONS',
                  language_in: 'ECMASCRIPT_2020',
                  language_out: 'ECMASCRIPT_2020',
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
                  language_in: 'ECMASCRIPT_2020',
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
          hax: {
            src: ['build/out.js'],
            overwrite: true,
            replacements: [
              // remove all consts so CC can aggregate consecutive declarations
              { 
                from: /(\s)const(\s)/g, 
                to: "$1let$2"
              },
              // webgl
              { from: "gl.canvas(", to: "gl['cas'](" }, { from: "gl.drawingBufferWidth(", to: "gl['drBWh'](" }, { from: "gl.drawingBufferHeight(", to: "gl['drBHt'](" }, { from: "gl.activeTexture(", to: "gl['acTe'](" }, { from: "gl.attachShader(", to: "gl['atSr'](" }, { from: "gl.bindAttribLocation(", to: "gl['biALn'](" }, { from: "gl.bindFramebuffer(", to: "gl['biFr'](" }, { from: "gl.bindRenderbuffer(", to: "gl['biRr'](" }, { from: "gl.bindTexture(", to: "gl['biTe'](" }, { from: "gl.blendColor(", to: "gl['blCr'](" }, { from: "gl.blendEquation(", to: "gl['blEn'](" }, { from: "gl.blendEquationSeparate(", to: "gl['blESe'](" }, { from: "gl.blendFunc(", to: "gl['blFc'](" }, { from: "gl.blendFuncSeparate(", to: "gl['blFSe'](" }, { from: "gl.bufferData(", to: "gl['buDa'](" }, { from: "gl.bufferSubData(", to: "gl['buSDa'](" }, { from: "gl.checkFramebufferStatus(", to: "gl['chFSs'](" }, { from: "gl.clear(", to: "gl['clr'](" }, { from: "gl.clearColor(", to: "gl['clCr'](" }, { from: "gl.clearDepth(", to: "gl['clDh'](" }, { from: "gl.clearStencil(", to: "gl['clSl'](" }, { from: "gl.colorMask(", to: "gl['coMk'](" }, { from: "gl.compileShader(", to: "gl['coSr'](" }, { from: "gl.compressedTexImage2D(", to: "gl['coTI2D'](" }, { from: "gl.compressedTexSubImage2D(", to: "gl['coTSI2D'](" }, { from: "gl.createBuffer(", to: "gl['crBr'](" }, { from: "gl.createFramebuffer(", to: "gl['crFr'](" }, { from: "gl.createProgram(", to: "gl['crPm'](" }, { from: "gl.createRenderbuffer(", to: "gl['crRr'](" }, { from: "gl.createShader(", to: "gl['crSr'](" }, { from: "gl.createTexture(", to: "gl['crTe'](" }, { from: "gl.cullFace(", to: "gl['cuFe'](" }, { from: "gl.deleteBuffer(", to: "gl['deBr'](" }, { from: "gl.deleteFramebuffer(", to: "gl['deFr'](" }, { from: "gl.deleteProgram(", to: "gl['dePm'](" }, { from: "gl.deleteRenderbuffer(", to: "gl['deRr'](" }, { from: "gl.deleteShader(", to: "gl['deSr'](" }, { from: "gl.deleteTexture(", to: "gl['deTe'](" }, { from: "gl.depthFunc(", to: "gl['deFc'](" }, { from: "gl.depthMask(", to: "gl['deMk'](" }, { from: "gl.depthRange(", to: "gl['deRe'](" }, { from: "gl.disable(", to: "gl['die'](" }, { from: "gl.disableVertexAttribArray(", to: "gl['diVAAy'](" }, { from: "gl.enable(", to: "gl['ene'](" }, { from: "gl.enableVertexAttribArray(", to: "gl['enVAAy'](" }, { from: "gl.finish(", to: "gl['fih'](" }, { from: "gl.flush(", to: "gl['flh'](" }, { from: "gl.framebufferRenderbuffer(", to: "gl['frRr'](" }, { from: "gl.framebufferTexture2D(", to: "gl['frT2D'](" }, { from: "gl.frontFace(", to: "gl['frFe'](" }, { from: "gl.generateMipmap(", to: "gl['geMp'](" }, { from: "gl.getActiveAttrib(", to: "gl['geAAb'](" }, { from: "gl.getActiveUniform(", to: "gl['geAUm'](" }, { from: "gl.getAttachedShaders(", to: "gl['geASs'](" }, { from: "gl.getAttribLocation(", to: "gl['geALn'](" }, { from: "gl.getBufferParameter(", to: "gl['geBPr'](" }, { from: "gl.getContextAttributes(", to: "gl['geCAs'](" }, { from: "gl.getError(", to: "gl['geEr'](" }, { from: "gl.getExtension(", to: "gl['geEn'](" }, { from: "gl.getFramebufferAttachmentParameter(", to: "gl['geFAPr'](" }, { from: "gl.getParameter(", to: "gl['gePr'](" }, { from: "gl.getProgramInfoLog(", to: "gl['gePILg'](" }, { from: "gl.getProgramParameter(", to: "gl['gePPr'](" }, { from: "gl.getRenderbufferParameter(", to: "gl['geRPr'](" }, { from: "gl.getShaderInfoLog(", to: "gl['geSILg'](" }, { from: "gl.getShaderParameter(", to: "gl['geSPr'](" }, { from: "gl.getShaderPrecisionFormat(", to: "gl['geSPFt'](" }, { from: "gl.getShaderSource(", to: "gl['geSSe'](" }, { from: "gl.getSupportedExtensions(", to: "gl['geSEs'](" }, { from: "gl.getTexParameter(", to: "gl['geTPr'](" }, { from: "gl.getUniform(", to: "gl['geUm'](" }, { from: "gl.getUniformLocation(", to: "gl['geULn'](" }, { from: "gl.getVertexAttrib(", to: "gl['geVAb'](" }, { from: "gl.getVertexAttribOffset(", to: "gl['geVAOt'](" }, { from: "gl.hint(", to: "gl['hit'](" }, { from: "gl.isBuffer(", to: "gl['isBr'](" }, { from: "gl.isContextLost(", to: "gl['isCLt'](" }, { from: "gl.isEnabled(", to: "gl['isEd'](" }, { from: "gl.isFramebuffer(", to: "gl['isFr'](" }, { from: "gl.isProgram(", to: "gl['isPm'](" }, { from: "gl.isRenderbuffer(", to: "gl['isRr'](" }, { from: "gl.isShader(", to: "gl['isSr'](" }, { from: "gl.isTexture(", to: "gl['isTe'](" }, { from: "gl.lineWidth(", to: "gl['liWh'](" }, { from: "gl.linkProgram(", to: "gl['liPm'](" }, { from: "gl.pixelStorei(", to: "gl['piSi'](" }, { from: "gl.polygonOffset(", to: "gl['poOt'](" }, { from: "gl.readPixels(", to: "gl['rePs'](" }, { from: "gl.renderbufferStorage(", to: "gl['reSe'](" }, { from: "gl.sampleCoverage(", to: "gl['saCe'](" }, { from: "gl.scissor(", to: "gl['scr'](" }, { from: "gl.shaderSource(", to: "gl['shSe'](" }, { from: "gl.stencilFunc(", to: "gl['stFc'](" }, { from: "gl.stencilFuncSeparate(", to: "gl['stFSe'](" }, { from: "gl.stencilMask(", to: "gl['stMk'](" }, { from: "gl.stencilMaskSeparate(", to: "gl['stMSe'](" }, { from: "gl.stencilOp(", to: "gl['stOp'](" }, { from: "gl.stencilOpSeparate(", to: "gl['stOSe'](" }, { from: "gl.texImage2D(", to: "gl['teI2D'](" }, { from: "gl.texParameterf(", to: "gl['tePf'](" }, { from: "gl.texParameteri(", to: "gl['tePi'](" }, { from: "gl.texSubImage2D(", to: "gl['teSI2D'](" }, { from: "gl.uniform1f(", to: "gl['un1f'](" }, { from: "gl.uniform1fv(", to: "gl['un1fv'](" }, { from: "gl.uniform1i(", to: "gl['un1i'](" }, { from: "gl.uniform1iv(", to: "gl['un1iv'](" }, { from: "gl.uniform2f(", to: "gl['un2f'](" }, { from: "gl.uniform2fv(", to: "gl['un2fv'](" }, { from: "gl.uniform2i(", to: "gl['un2i'](" }, { from: "gl.uniform2iv(", to: "gl['un2iv'](" }, { from: "gl.uniform3f(", to: "gl['un3f'](" }, { from: "gl.uniform3fv(", to: "gl['un3fv'](" }, { from: "gl.uniform3i(", to: "gl['un3i'](" }, { from: "gl.uniform3iv(", to: "gl['un3iv'](" }, { from: "gl.uniform4f(", to: "gl['un4f'](" }, { from: "gl.uniform4fv(", to: "gl['un4fv'](" }, { from: "gl.uniform4i(", to: "gl['un4i'](" }, { from: "gl.uniform4iv(", to: "gl['un4iv'](" }, { from: "gl.uniformMatrix2fv(", to: "gl['unM2fv'](" }, { from: "gl.uniformMatrix3fv(", to: "gl['unM3fv'](" }, { from: "gl.uniformMatrix4fv(", to: "gl['unM4fv'](" }, { from: "gl.useProgram(", to: "gl['usPm'](" }, { from: "gl.validateProgram(", to: "gl['vaPm'](" }, { from: "gl.vertexAttrib1f(", to: "gl['veA1f'](" }, { from: "gl.vertexAttrib1fv(", to: "gl['veA1fv'](" }, { from: "gl.vertexAttrib2f(", to: "gl['veA2f'](" }, { from: "gl.vertexAttrib2fv(", to: "gl['veA2fv'](" }, { from: "gl.vertexAttrib3f(", to: "gl['veA3f'](" }, { from: "gl.vertexAttrib3fv(", to: "gl['veA3fv'](" }, { from: "gl.vertexAttrib4f(", to: "gl['veA4f'](" }, { from: "gl.vertexAttrib4fv(", to: "gl['veA4fv'](" }, { from: "gl.vertexAttribPointer(", to: "gl['veAPr'](" }, { from: "gl.viewport(", to: "gl['vit'](" }, { from: "gl.bindBuffer(", to: "gl['biBr'](" }, { from: "gl.drawArrays(", to: "gl['drAs'](" }, { from: "gl.drawElements(", to: "gl['drEs'](" }, { from: "gl.makeXRCompatible(", to: "gl['maXRCe'](" },
              // 2d
              { from: "stx.canvas(", to: "stx['cas'](" }, { from: "stx.globalAlpha(", to: "stx['glAa'](" }, { from: "stx.globalCompositeOperation(", to: "stx['glCOn'](" }, { from: "stx.filter(", to: "stx['fir'](" }, { from: "stx.imageSmoothingEnabled(", to: "stx['imSEd'](" }, { from: "stx.imageSmoothingQuality(", to: "stx['imSQy'](" }, { from: "stx.strokeStyle(", to: "stx['stSe'](" }, { from: "stx.fillStyle(", to: "stx['fiSe'](" }, { from: "stx.shadowOffsetX(", to: "stx['shOX'](" }, { from: "stx.shadowOffsetY(", to: "stx['shOY'](" }, { from: "stx.shadowBlur(", to: "stx['shBr'](" }, { from: "stx.shadowColor(", to: "stx['shCr'](" }, { from: "stx.lineWidth(", to: "stx['liWh'](" }, { from: "stx.lineCap(", to: "stx['liCp'](" }, { from: "stx.lineJoin(", to: "stx['liJn'](" }, { from: "stx.miterLimit(", to: "stx['miLt'](" }, { from: "stx.lineDashOffset(", to: "stx['liDOt'](" }, { from: "stx.font(", to: "stx['fot'](" }, { from: "stx.textAlign(", to: "stx['teAn'](" }, { from: "stx.textBaseline(", to: "stx['teBe'](" }, { from: "stx.direction(", to: "stx['din'](" }, { from: "stx.clip(", to: "stx['clp'](" }, { from: "stx.createImageData(", to: "stx['crIDa'](" }, { from: "stx.createLinearGradient(", to: "stx['crLGt'](" }, { from: "stx.createPattern(", to: "stx['crPn'](" }, { from: "stx.createRadialGradient(", to: "stx['crRGt'](" }, { from: "stx.drawFocusIfNeeded(", to: "stx['drFINd'](" }, { from: "stx.drawImage(", to: "stx['drIe'](" }, { from: "stx.fill(", to: "stx['fil'](" }, { from: "stx.fillText(", to: "stx['fiTt'](" }, { from: "stx.getContextAttributes(", to: "stx['geCAs'](" }, { from: "stx.getImageData(", to: "stx['geIDa'](" }, { from: "stx.getLineDash(", to: "stx['geLDh'](" }, { from: "stx.getTransform(", to: "stx['geTm'](" }, { from: "stx.isPointInPath(", to: "stx['isPIPh'](" }, { from: "stx.isPointInStroke(", to: "stx['isPISe'](" }, { from: "stx.measureText(", to: "stx['meTt'](" }, { from: "stx.putImageData(", to: "stx['puIDa'](" }, { from: "stx.save(", to: "stx['sae'](" }, { from: "stx.scale(", to: "stx['sce'](" }, { from: "stx.setLineDash(", to: "stx['seLDh'](" }, { from: "stx.setTransform(", to: "stx['seTm'](" }, { from: "stx.stroke(", to: "stx['ste'](" }, { from: "stx.strokeText(", to: "stx['stTt'](" }, { from: "stx.transform(", to: "stx['trm'](" }, { from: "stx.translate(", to: "stx['tre'](" }, { from: "stx.arcTo(", to: "stx['arTo'](" }, { from: "stx.beginPath(", to: "stx['bePh'](" }, { from: "stx.bezierCurveTo(", to: "stx['beCTo'](" }, { from: "stx.clearRect(", to: "stx['clRt'](" }, { from: "stx.closePath(", to: "stx['clPh'](" }, { from: "stx.ellipse(", to: "stx['ele'](" }, { from: "stx.fillRect(", to: "stx['fiRt'](" }, { from: "stx.lineTo(", to: "stx['liTo'](" }, { from: "stx.moveTo(", to: "stx['moTo'](" }, { from: "stx.quadraticCurveTo(", to: "stx['quCTo'](" }, { from: "stx.rect(", to: "stx['ret'](" }, { from: "stx.resetTransform(", to: "stx['reTm'](" }, { from: "stx.restore(", to: "stx['ree'](" }, { from: "stx.rotate(", to: "stx['roe'](" }, { from: "stx.strokeRect(", to: "stx['stRt'](" }
            ]
          },
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
          html2: {
            src: ['dist/index.html'],
            overwrite: true,
            replacements: [{
              from: /id=\"(\w+)\"/g,
              to: "id=$1"
            }, {
              from: /class=\"(\w+)\"/g,
              to: "class=$1"
            }, {
              from: /name=\"(\w+)\"/g,
              to: "name=$1"
            }]
          },          
          js: {
              src: ['dist/out.min.js'],
              overwrite: true,
              replacements: [{
                from: "'use strict';",
                to:""
              }, {
                from: /\/\/([^\n])*\n/g,
                to:""
              }, /*{
                from: /\/\*(.|\\n)*\*\//g,
                to:""
              }, */{
                from: /\$\{\"((\w|\d|\.)*)\"\}/g,
                to: "$1"
              }, {
                from: /\$\{(\-?(\d|\.)*)\}/g,
                to: "$1"
              }, {
                from: "void 0",
                to: "null"
              }, {
                from: "const ",
                to: "var "
              }, {
                from: "const[",
                to: "var["
              }, {
                from: "const{",
                to: "var{"
              }, {
                from: "let ",
                to: "var "
              }, {
                from: "let{",
                to: "var{"
              }, {
                from: "let[",
                to: "var["
              }, {
                from: /(\,|\{)\["(\w+)"\]:/g,
                to: "$1$2:"
              }, {
                from: "${Math.random()/999}",
                to: "0.",
              }, {
                from: "forEach",
                to: "map"
              }, {
                from: "-58-32",
                to:"-90",
              }, {
                from: /var ([a-zA-Z_$]+=[^;\{]+);var/g,
                to: "var $1,",
              }]
          },
          js2: { // second pass for the bits that we changed above
            src: ['dist/out.min.js'],
            overwrite: true,
            replacements: [{
              from: /(\s)+/g,
              to:" "
            }, {
              from: /((\\n)\s*)+/g,
              to:" "
            }, {
              from: /([^a-zA-Z0-9$])\s(\w)/g,
              to: "$1$2"
            }, {
              from: /(\w)\s([^a-zA-Z0-9$])/g,
              to: "$1$2"
            }, {
              from: /([^a-zA-Z0-9$])\s([^a-zA-Z0-9$])/g,
              to: "$1$2"
            }]
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
  grunt.registerTask('dist', ['prod', 'replace:hax', 'closure-compiler:es2020', 'copy','cssmin','replace:html', 'replace:js', 'replace:js2', 'replace:js2', 'inline', 'htmlmin','replace:html2']);
  grunt.registerTask('default', ['prod', 'connect', 'watch']);

};