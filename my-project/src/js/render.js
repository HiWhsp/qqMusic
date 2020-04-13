(function ($, root) {
    const $scope = $(document.body);
    // 渲染图片
    function renderImg(src) {
        const img = new Image();
        img.src = src;
        img.onload = function () {
            $scope.find('.song-img img').attr('src', src);
            root.blurImg(img, $scope);
        }
    }
    // 渲染信息
    function renderInfo(data) {
        const html = `<div class="song-name">${data.song}</div>
        <div class="singer-name">${data.singer}</div>
        <div class="album-name">${data.album}</div>`;
        $scope.find('.song-info').html(html);
    }
    // 图标切换
    function renderIsLike(isLike) {
        if (isLike) {
            if (isLike) {
                $scope.find(".like-btn").addClass("liking");
            } else {
                $scope.find(".like-btn").removeClass("liking");
            }
        }
    }

    root.render = function (data) {
        renderImg(data.image)
        renderInfo(data);
        renderIsLike(data.isLike);
    }

})(window.Zepto, window.player || (window.player = {}))