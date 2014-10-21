(function () {
    $('body').append('<i class="J-up-top up-top fa fa-chevron-up"></i>');
    $('body').delegate('click', '.J-up-top', function () {
        window.scrollTo(0, 0);
    });
})();
