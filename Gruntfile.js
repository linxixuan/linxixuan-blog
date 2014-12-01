module.exports = function (grunt) {
    grunt.initConfig({
        stylus: {
            compile: {
                files: {
                    'public/stylesheets/base.css': 'public/stylus/base.styl'
                }
            }
        },

        jshint: {
            options: {
                "curly": true,
                "eqnull": true,
                "eqeqeq": true,
                "undef": true,
                "globals": {
                    "jQuery": true
                }
            }
        },

        watch: {
            // 服务端代码更新需要重启服务器
            //server: {},

            // 客户端代码更新需要刷新浏览器
            client: {
                files: ['public/javascripts/*.js'],
                tasks: ['jshint'],
            },

            // 更新stylus文件，需要重新编译
            css: {
                tasks: ['default'],
                files: 'public/stylus/*.styl'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['stylus', 'watch']);
}
