module.exports = (grunt) ->
  grunt.initConfig
    ts:
      options:
        compile: true
        removeComments: false
        target: 'es5'
        module: 'amd'
        noImplicitAny: true
        sourceMap: false
      default:
        src: ['nova/**/*.ts', '!node_modules/**/*.ts']
        html: ['nova/**/*.html', '!node_modules/**/*.html']
    typedoc:
        build:
            options:
                module: 'amd'
                out: './gh-pages/docs'
                name: 'nova-toolkit'
                mode: 'modules'
                target: 'es6'
            src: ['nova/**/*.ts', '!node_modules/**/*.ts', '!nova/tests/**/*.ts']
    express:
        test:
            options:
                script: './nova/tests/test-server.js'
                background: true
    watch:
         default:
             files: ['nova/**/*.ts', 'nova/**/*.html']
             tasks: ['ts']
             options:
                  spawn: false
    open:
        test:
            path: 'http://localhost:3000/node_modules/intern/client.html?config=nova/tests/intern'

    clean: ['nova/**/*.js']

  grunt.event.on 'watch', (action, filepath) ->
    if !!~ filepath.indexOf ".html"
        grunt.config.set('ts.default.src', [])
        grunt.config.set('ts.default.html', filepath)
    else
        grunt.config.set('ts.default.src', filepath)


  grunt.loadNpmTasks 'grunt-ts'
  grunt.loadNpmTasks 'grunt-typedoc'
  grunt.loadNpmTasks 'grunt-express-server'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-open'

  grunt.registerTask 'default', ['clean', 'typedoc', 'ts']
  grunt.registerTask 'doc', ['typedoc']
  grunt.registerTask 'transpile', ['clean', 'ts']
  grunt.registerTask 'dev', ['clean', 'ts', 'express', 'open', 'watch']
