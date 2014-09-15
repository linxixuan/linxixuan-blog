$(function () {
    window.onload = function () {
        $('header').addClass('header--anim');

        $('header .nav li').each(function (index) {
            $(this).addClass('li--anim');
            $(this).css('transition-delay', (0.5 + index * 0.2) + 's');
            $(this).css('-webkit-transition-delay', (0.5 + index * 0.2) + 's');
        });

        $('header .social').addClass('social--anim');

        $('.pg-index .blog').each(function (index) {
            $(this).addClass('blog--anim');
            $(this).css('transition-delay', (1.5 + index * 0.2) + 's');
            $(this).css('-webkit-transition-delay', (1.5 + index * 0.2) + 's');
        });
    };
});
