// 获取数据
let dataList;
// 获取渲染界面的接口
const root = window.player;
// 存放歌曲的索引值
let nowIndex = 0;
// 切换索引值的构造函数
let controlManager;
// 获取音频播放构造函数
let audioManager = root.audioManager;
// 定时器
let timer = null;
// 获取数据
function getData(url) {
    $.ajax({
        url: url,
        type: "GET",
        success: function (data) {
            controlManager = new root.controlManager(data.length);
            root.playList.renderList(data);
            dataList = data;
            root.render(dataList[0]); // 初始渲染
            root.pro.renderAllTime(dataList[0].duration); // 渲染时间
            audioManager.getAudio(dataList[0].audio); // 获取音频资源
            bindTouch(); // 开启拖拽事件
            bindEvent(); // 开启绑定事件
        },
        error: function (error) {
            console.log(error);
        }
    })
}
// 绑定函数
function bindEvent() {
    // 左右切歌的共同代码
    $('body').on("play:change", function (e, index) {
        audioManager.getAudio(dataList[index].audio);
        root.render(dataList[index]);
        if (audioManager.status === "play") {
            rotated(0);
            audioManager.play();
        }
        $('.img-wrapper').attr('data-deg', 0);
        $('.img-wrapper').css({
            'transform': 'rotateZ(0deg)',
            'transition': 'none'
        })
        root.pro.renderAllTime(dataList[index].duration);
    })
    // 上一首
    $('.prev-btn').on('click', function () {
        nowIndex = controlManager.prev();
        $('body').trigger("play:change", nowIndex);
        root.pro.start(0);
        if (audioManager.status === "pause") {
            audioManager.pause();
            root.pro.stop();
        }
    })
    // 下一首
    $('.next-btn').on('click', function () {
        nowIndex = controlManager.next();
        $('body').trigger("play:change", nowIndex);
        root.pro.start(0);
        if (audioManager.status === "pause") {
            audioManager.pause();
            root.pro.stop();
        }
    })
    // 播放/暂停
    $('.play-btn').on('click', function () {
        if (audioManager.status === "pause") {
            audioManager.play();
            root.pro.start();
            let deg = $('.img-wrapper').attr('data-deg');
            rotated(deg);
        } else {
            audioManager.pause();
            root.pro.stop();
            clearInterval(timer);
        }
        $('.play-btn').toggleClass("playing");
    })
    // 列表切歌
    $('.list-btn').on('click', function () {
        root.playList.show(controlManager);
    })
    // 进度条点击
    $('.pro-wrapper').on('click', function (e) {
        let deg = $('.img-wrapper').attr('data-deg');
        rotated(deg);
        const offset = $('.pro-bottom').offset();
        const left = offset.left;
        const width = offset.width;
        const x = e.clientX;
        const per = (x - left) / width;
        if (per >= 0 && per <= 1) {
            const curTime = per * dataList[controlManager.index].duration;
            $('.play-btn').addClass('playing'); // 改变播放按钮(类名)
            audioManager.playTo(curTime);  // 从该位置播放
            audioManager.status = "play"; // 改变歌曲播放状态
            audioManager.play() // 播放歌曲
            root.pro.start(per);  // 改变进度条进度
        }
    })
}

// 歌曲图片转动
function rotated(deg) {
    clearInterval(timer);
    deg = +deg;
    timer = setInterval(function () {
        deg += 2;
        $('.img-wrapper').attr('data-deg', deg);
        $('.img-wrapper').css({
            'transform': 'rotateZ(' + deg + 'deg)',
            'transition': 'all 1s ease-out'
        })
    }, 200)
}

// 进度条拖拽
function bindTouch() {
    const $spot = $('.slider-point');
    const offset = $('.pro-bottom').offset();
    const left = offset.left;
    const width = offset.width;
    $spot.on("touchstart", function () {
        root.pro.stop();
    }).on("touchmove", function (e) {
        const x = e.changedTouches[0].clientX;
        const per = (x - left) / width;
        if (per >= 0 && per <= 1) {
            root.pro.updata(per);
        }
    }).on("touchend", function (e) {
        // 开始播放 播放相应的时间位置curTime   per * curTime
        const x = e.changedTouches[0].clientX;
        const per = (x - left) / width;
        if (per >= 0 && per <= 1) {
            const curTime = per * dataList[controlManager.index].duration;
            $('.play-btn').addClass('playing'); // 改变播放按钮(类名)
            audioManager.playTo(curTime);  // 从该位置播放
            audioManager.status = "play"; // 改变歌曲播放状态
            audioManager.play() // 播放歌曲
            root.pro.start(per);  // 改变进度条进度
        }
        if(audioManager.status == "play") {
            let deg = $('.img-wrapper').attr('data-deg');
            rotated(deg);
        }
    })
}

getData("../mock/data.json");