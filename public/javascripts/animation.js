$(function () {
    var RIGHT = 39,
        TOP = 38,
        DOWN = 40,
        LEFT = 37,
        SPACE = 32;
        sliderIndex = 0,
        sliderNum = $('.slider').length;

    $('body').keydown(function (e) {
        var code = e.keyCode;

        if (code === LEFT || code === TOP) {
            switchSlider('backward');
        } else if (code === RIGHT || code === DOWN || code === SPACE) {
            switchSlider('forward');
        }
    });

    function switchSlider (type) {
        var nextIndex,
            ndNextSlider,
            ndCurrentSlider;
        if (type === 'backward') {
            nextIndex = sliderIndex - 1;
        } else {
            nextIndex = sliderIndex + 1;
        }

        if (nextIndex === -1 || nextIndex === sliderNum) {
            return;
        }
        
        ndNextSlider = $($('.slider')[nextIndex]);
        ndCurrentSlider = $($('.slider')[sliderIndex]);

        if (type === 'forward') {
            ndCurrentSlider.show();
            ndCurrentSlider.css('top', 0);
            ndCurrentSlider.removeClass('slider--rmovein');
            ndCurrentSlider.removeClass('slider--rmoveout');
            ndCurrentSlider.removeClass('slider--movein');
            ndCurrentSlider.addClass('slider--moveout');
            setTimeout(function () {
                ndCurrentSlider.hide();
                ndNextSlider.show();
                ndNextSlider.css('top', 0);
                ndNextSlider.removeClass('slider--rmovein');
                ndNextSlider.removeClass('slider--rmoveout');
                ndNextSlider.removeClass('slider--moveout');
                ndNextSlider.addClass('slider--movein');
            }, 1000);
        } else {
            ndCurrentSlider.show();
            ndCurrentSlider.css('top', '-1000px');
            ndCurrentSlider.removeClass('slider--movein');
            ndCurrentSlider.removeClass('slider--moveout');
            ndCurrentSlider.removeClass('slider--rmoveout');
            ndCurrentSlider.addClass('slider--rmovein');
            setTimeout(function () {
                ndCurrentSlider.hide();
                ndNextSlider.show();
                ndNextSlider.removeClass('slider--movein');
                ndNextSlider.removeClass('slider--moveout');
                ndNextSlider.removeClass('slider--rmovein');
                ndNextSlider.addClass('slider--rmoveout');
            }, 1000);
        }

        sliderIndex = nextIndex;
    }
});
