// GRUNT CONFIGURATION FILE

module.exports = function(grunt) {
    grunt.initConfig({
        //devDeployPath: 'C:/Dev/',
        //compile less files in the respective theme folders
        less: {
            build: {
                options: {
                    plugins: [
                      new (require('less-plugin-autoprefix'))({browsers: ["last 2 versions"]}),
                      new (require('less-plugin-clean-css'))({})
                    ]
                },
                files: {
                    'site/styles/style.css': 'site/styles/style.less'
                }
            }
        },
        // copy source files to both templates
        //copy: {
        //    build: {
        //        files: [
        //            {expand: true, cwd: 'src', src: ['**', '!**/*.less'], dest: 'dist/, filter: 'isFile'},
        //            {expand: true, cwd: 'src', src: ['**', '!**/*.less'], dest: 'dist/', filter: 'isFile'},
        //        ],
        //    },
        //}, 
        // clean the dist folder        
        //clean: {
        //    options: {
        //        force: true
        //    },
        //    build: ['dist'],
        //    development: ['<%= devDeployPath %>/hitachi-dawn', '<%= devDeployPath %>/hitachi-wicked'],
        //},
        //watch for changes
        watch: {
          files: ['site/**/*.less'],
          tasks: ['less']
        }
    });
    
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');

    //DEFAULT 
    grunt.registerTask('default', ['less:build','watch']);
    //BUILD MODE
    grunt.registerTask('build', ['less:build']);
    //DEVELOPMENT MODE
    grunt.registerTask('dev', ['less:build', 'watch']);
    
    
};
