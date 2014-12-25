(function () {
    if (/music/.test(location.href)) {
    } else {
        $('body').append('<i class="J-up-top up-top fa fa-chevron-up"></i>');
        $('.J-up-top').on('click', function () {
            $('body').animate({scrollTop: 0}, '500');
        });
    }
})();
