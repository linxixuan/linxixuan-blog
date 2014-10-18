$(function () {
    init();

    function init() {
        setAudio($('.music-list li .music__url').html());
        insertControllers();
        bindEvent();
    }

    function bindEvent() {
        bindPlayList();
        bindControll();
    }

    function bindControll() {
        $('body').delegate('.music-info .cover, .music-info .J-status', 'click', function () {
            if (!player) return;

            if(player.paused) {
                player.play();
            } else {
                player.pause();
            }

            $('.music-info .status-wrapper').addClass('status-wrapper--anim');
            $('.music-info .status-wrapper')[0].addEventListener('webkitAnimationEnd', function () {
                $('.music-info .status-wrapper').removeClass('status-wrapper--anim');
            });
        });

        player.onplay = function () {
            $('.music-info .J-status').addClass('fa-pause');
            $('.music-info .J-status').removeClass('fa-play');
            $('.music-info .J-status').removeClass('status--pause');
        }

        player.onpause = function () {
            $('.music-info .J-status').removeClass('fa-pause');
            $('.music-info .J-status').addClass('fa-play');
            $('.music-info .J-status').addClass('status--pause');
        }
    }

    function bindPlayList() {
        $('.music-list-wrapper .J-trigger').hover(function () {
            $(this).next('.music-list').show();
            $(this).next('.music-list').addClass('music-list--expand');
        });
        $('.music-list').on('mouseleave', function () {
            $(this).removeClass('music-list--expand');
        });
        $('.music-list li').hover(function () {
            $('.active').removeClass('active');
            $(this).addClass('active');
        });
        $('.music-list li').click(function () {
            var id = $(this).find('.music__title').data('id'),
                title = $(this).find('.music__title').data('title'),
                url = $(this).find('.music__url').html();
            $.ajax({
                url: '/getMusicInfo?id=' + id,
                method: 'get'
            }).done(function(data) {
                var music = JSON.parse(data),
                    ndInfo = $('.music-info'),
                    author = [];
                
                ndInfo.find('.cover')[0].src = music.image.replace(/spic/, 'lpic');
                ndInfo.find('.name')[0].innerHTML = title;
                ndInfo.find('.track')[0].innerHTML = music.alt_title;
                for(var p in music.author) {
                    author.push(music.author[p].name); 
                }
                author = author.join('/');
                ndInfo.find('.author')[0].innerHTML = author;
                ndInfo.find('.description')[0].innerHTML = music.summary;

                player.src = url;
            });
        });
    }

    // 设置音乐插件
    function setAudio(url) {
        $('.J-placeholder').html(ReferrerKiller.htmlString('<audio controls autoplay name="media"><source src="' + url + '" type="audio/mpeg"></audio>'));
    }

    // 插入控制功能
    function insertControllers() {
        var innerWindow = $('.J-placeholder').find('iframe')[0].contentWindow,
            ndBody = $(innerWindow.document.body);
        ndBody.append('<script src="' + location.origin + '/javascripts/jquery-1.11.1.min.js"></script>');
        player = ndBody.find('audio')[0];
    }

    /**
     * 音乐控制对象
     */
    controller = {

        // 当前播放音乐的ID
        currentID: null,

        // 播放器
        player: null,

        // 自动播放
        autoPlay: true,

        /**
         * 初始化
         * @param node control selector
         */
        init: function () {
            this.player = $();
        },

        // 暂停
        pause: function () {
        },
        
        /**
         * 播放
         */
        play: function () {
        },

        // 下一首
        next: function () {
        }
        //
    };
});
