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
        src: ['**/*.ts', '!node_modules/**/*.ts']
    typedoc:
        build:
            options:
                module: 'amd'
                out: './gh-pages/docs'
                name: 'nova-toolkit'
                mode: 'modules'
                target: 'es6'
            src: ['**/*.ts', '!node_modules/**/*.ts', '!nova/tests/**/*.ts']
    express:
        test:
            options:
                script: './nova/tests/test-server.js'
                background: false

  grunt.loadNpmTasks 'grunt-ts'
  grunt.loadNpmTasks 'grunt-typedoc'
  grunt.loadNpmTasks 'grunt-express-server'

  grunt.registerTask 'default', ['typedoc', 'ts']
  grunt.registerTask 'doc', ['typedoc']
  grunt.registerTask 'transpile', ['ts']
  grunt.registerTask 'test', ['ts', 'express']
