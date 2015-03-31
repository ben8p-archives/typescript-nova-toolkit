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

  grunt.loadNpmTasks 'grunt-ts'
  grunt.registerTask 'default', ['ts']