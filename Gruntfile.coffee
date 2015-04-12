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
            src: ['nova/**/*.ts', 'tests/**/*.ts']
            html: ['nova/**/*.html', 'tests/**/*.html']
    typedoc:
        default:
            options:
                module: 'amd'
                out: './gh-pages/docs'
                name: 'nova-toolkit'
                mode: 'modules'
                target: 'es6'
            src: ['nova/**/*.ts']
    express:
        default:
            options:
                script: './tests/test-server.js'
                background: true
        nowatch:
            options:
                script: './tests/test-server.js'
                background: false
    watch:
         default:
             files: ['nova/**/*.ts', 'nova/**/*.html', 'tests/**/*.ts', 'tests/**/*.html']
             tasks: ['ts']
             options:
                  spawn: false
    open:
        default:
            path: 'http://localhost:3000/node_modules/intern/client.html?config=tests/intern'
        nowatch:
            path: 'http://localhost:3000/node_modules/intern/client.html?config=tests/intern'
            options:
                delay: 500
    clean: ['nova/**/*.js', 'tests/**/*.js']
    requirejs:
        release:
            options:
                appDir: './nova/'
                dir: './release/'
        custom:
            options:
                baseUrl: './'
                out: './release/' + grunt.option('build-config') + '.js'
                include: grunt.option('build-config')

  grunt.event.on 'watch', (action, filepath) ->
    if !!~ filepath.indexOf ".html"
        grunt.config.set('ts.default.src', [])
        grunt.config.set('ts.default.html', filepath)
    else
        grunt.config.set('ts.default.src', filepath)

  requireJsTarget = 'release'
  if grunt.option('build-config')?
      requireJsTarget = 'custom'

  grunt.loadNpmTasks 'grunt-ts'
  grunt.loadNpmTasks 'grunt-typedoc'
  grunt.loadNpmTasks 'grunt-express-server'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-open'
  grunt.loadNpmTasks 'grunt-contrib-requirejs'

  grunt.registerTask 'default', ['clean', 'typedoc', 'ts']
  grunt.registerTask 'doc', ['typedoc']
  grunt.registerTask 'transpile', ['clean', 'ts']
  grunt.registerTask 'dev', ['clean', 'ts', 'express', 'open', 'watch']
  grunt.registerTask 'dev:nowatch', ['clean', 'ts', 'open:nowatch', 'express:nowatch']
  grunt.registerTask 'release', ['clean', 'ts', 'requirejs:' + requireJsTarget]
