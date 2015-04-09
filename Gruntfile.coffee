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
                out: './docs'
                name: 'nova-toolkit'
                mode: 'modules'
                target: 'es6'
            src: ['**/*.ts', '!node_modules/**/*.ts', '!nova/tests/**/*.ts']

  grunt.loadNpmTasks 'grunt-ts'
  grunt.loadNpmTasks 'grunt-typedoc'
  grunt.registerTask 'default', ['typedoc', 'ts']
