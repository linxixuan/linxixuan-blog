define(["jquery", "referrerkiller", "tool", "ga"], function ($) {
    var player;
    $(function () {
        init();

        function init() {
            setAudio($('.music-list li .music__url').html());
            insertControllers();
            bindEvent();
            createTool();
        }

        function bindEvent() {
            bindPlayList();
            bindControll();
        }

        function bindControll() {
            player = $('.J-placeholder iframe')[0].contentWindow.document.querySelector('audio');
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
            bindAudio(player);
        }

        function bindAudio(player) {
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

            player.onended = function () {
                var index = Math.floor(Math.random() * 10);
                changeSong(index);
                $('.music-info .J-status').addClass('fa-pause');
                $('.music-info .J-status').removeClass('fa-play');
                $('.music-info .J-status').removeClass('status--pause');
            }
        }

        function bindPlayList() {
            $('.music-list-wrapper .J-trigger').hover(function () {
                $(this).next('.music-list').show();
                $(this).next('.music-list').addClass('music-list--expand');
            });
            $('.music-list').on('mouseleave, click', function () {
                var that = this;
                setTimeout(function () {
                    $(that).removeClass('music-list--expand');
                }, 500);
            });
            $('.music-list li').hover(function () {
                $('.active').removeClass('active');
                $(this).addClass('active');
            });
            $('.music-list li').click(function () {
                var index = $('.music-list li').index(this);
                changeSong(index);
            });
        }

        function changeSong(index) {
            var ndTarget = $($('.music-list li')[index]),
                id = ndTarget.find('.music__title').data('id'),
                title = ndTarget.find('.music__title').data('title'),
                url = ndTarget.find('.music__url').html();
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
                setAudio($($('.music-list li')[index]).find('.music__url').html());
            });
        }

        // 设置音乐插件
        function setAudio(url) {
            $('.J-placeholder').html(ReferrerKiller.htmlString('<audio controls name="media"><source src="' + url + '" type="audio/mpeg"></audio>'));
            player = $('.J-placeholder iframe')[0].contentWindow.document.querySelector('audio');
            player.play();
            bindAudio(player);
        }

        // 插入控制功能
        function insertControllers() {
            var innerWindow = $('.J-placeholder').find('iframe')[0].contentWindow,
                ndBody = $(innerWindow.document.body);
            ndBody.append('<script src="' + location.origin + '/javascripts/jquery-1.11.1.min.js"></script>');
            player = ndBody[0].querySelector('audio');
        }

        function updateMusicList(arr) {
            var res = '',
                item;
            for(var i = 0 , len = arr.length; i < len; i++) {
                item = arr[i];
                res += '<li>' +
                        '<h4 class="music__title" data-id="' + item.douban_id + '" data-title="' + item.title + '"><i class="fa fa-music"></i>&nbsp;' + item.title + '</h4>' +
                        '<div class="extra">' +
                            '<p class="music__author"><i class="fa fa-male"></i>&nbsp;' + item.author + '</p>' +
                            '<p class="music__track"><i class="fa fa-dot-circle-o"></i>&nbsp;' + item.track + '</p>' +
                            '<p class="music__url" style="display:none">' + item.url + '</p>' +
                        '</div>' +
                    '</li>';
            }
            
            $('.music-list').html(res);
            bindPlayList();
            changeSong(0);
        }

        function createTool() {
            var tool = '<i class="fa fa-music tool-trigger J-tool-trigger boom"></i>',
                toolWrapper = '' +
                '<div class="J-tool-wrapper tool-wrapper">' +
                    '<i class="fa fa-plus J-plus tool"></i>' +
                    '<i class="fa fa-minus J-minus tool"></i>' +
                    '<i class="fa fa-forward J-next tool"></i>' +
                    '<i class="fa fa-fast-forward J-next-decade tool"></i>' +
                '</div>',
                nlTool;

            $('body').append(tool);
            $('body').append(toolWrapper);

            toolWrapper = $('.J-tool-wrapper');
            $('.J-tool-trigger').click(function () {
                $(this).removeClass('boom');
                $('.J-tool-wrapper i').each(function (index) {
                    $(this).addClass('r' + (index + 1));
                });
            });

            $('.J-next').on('click', function () {
                changeSong(parseInt(Math.random() * 10, 10));
            });

            $('.J-next-decade').on('click', function () {
                $.ajax({
                    url: '/musiclist',
                    method: 'get'
                }).done(function(data) {
                    updateMusicList(JSON.parse(data));
                });
            });
        }
    });
});
