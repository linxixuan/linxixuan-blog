define(["jquery", "ga"], function ($) {
    window.hasMakeStar = false;
    window.isDay = true;

    function sunset () {
        $('.sun').addClass('fall');
        $('.moon').addClass('moon-rise');
        $('.sun').removeClass('rise');
        $('.moon').removeClass('moon-fall');

        $('.cloud--left').addClass('cloud-hide');
        $('.cloud--right').addClass('cloud-hide--right');
        $('.cloud--down').addClass('cloud-hide--down');

        $('.sky').addClass('sky-hide');
        $('.sky-night').addClass('sky-light');
        $('.sky-night').removeClass('sky-hide');
        $('.sky').removeClass('sky-light');
        setTimeout(function () {
            makeStars();
            isDay = false;
        }, 1500);
    }

    function sunrise () {
        $('.sun').removeClass('fall');
        $('.moon').addClass('moon-fall');
        $('.sun').addClass('rise');
        $('.moon').removeClass('moon-rise');

        $('.sky-night').addClass('sky-hide');
        $('.sky').addClass('sky-light');
        $('.sky').removeClass('sky-hide');
        $('.sky-night').removeClass('sky-light');
        setTimeout(function () {
            $('.star').hide();
            $('.cloud--left').removeClass('cloud-hide');
            $('.cloud--right').removeClass('cloud-hide--right');
            $('.cloud--down').removeClass('cloud-hide--down');
            isDay = true;
        }, 1500);
    }

    function makeStars() {
        if (!hasMakeStar) {
            var count = 50,
                i = 0,
                starStr = '',
                top = 0,
                left = 0,
                r,
                winWidth = window.innerWidth,
                winHeight = window.innerHeight;
            while(i < count) {
                r = parseInt(Math.random() * 5) + 1;
                top = parseInt(Math.random() * winHeight);
                left = parseInt(Math.random() * winWidth);
                delay = (parseInt(Math.random() * 10) / 10) + 's';

                starStr += '<div class="star" style="height:' + r + 'px;width:' + r+ 'px;top:' + top + 'px;left:' + left + 'px;animation-delay:' + delay+ ';-webkit-animation-delay:' + delay + '"></div>';
                i++;
            }
            
            $('body').append(starStr);
            window.hasMakeStar = true;
        } else {
            $('.star').show();
        }
    }

    window.makeStars = makeStars;
    window.sunset = sunset;
    window.sunrise = sunrise;
    $('.J-button').click(function () {
        if (window.isDay) {
            $(this).val('我很忙');
            sunset();
        } else {
            $(this).val('我不忙');
            sunrise();
        }
    });
});
