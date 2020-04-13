(function ($, root) {
    let frameId;
    let allTime;
    let lastPer = 0;
    let startTime;
    // 渲染总时间
    function renderAllTime(time) {
        allTime = time;
        time = formatTime(time)
        $('.all-time').html(time);
        $('.cur-time').html("00:00");
    }

    // 时间格式化
    function formatTime(time) {
        time = Math.round(time);
        let m = Math.floor(time / 60);
        let s = time - m * 60;
        m = ("0" + m).slice(-2);
        s = ("0" + s).slice(-2);
        return m + ":" + s;
    }

    // 音乐播放
    function start(t) {
        lastPer = t === undefined ? lastPer : t;
        startTime = new Date().getTime();
        cancelAnimationFrame(frameId);
        function frame() {
            const curTime = new Date().getTime();
            const per = lastPer + (curTime - startTime) / (allTime * 1000);
            if (per <= 1) {
                updata(per)
            } else {
                cancelAnimationFrame(frameId);
            }
            frameId = requestAnimationFrame(frame);
        }
        frame()
    }

    function updata(per) {
        const curTime = formatTime(allTime * per);
        const perX = (per - 1) * 100 + "%";
        $('.cur-time').html(curTime);
        $('.pro-top').css({
            transform: 'translateX(' + perX + ')'
        })
    }
    // 音乐停止/暂停
    function stop() {
        cancelAnimationFrame(frameId);
        const stopTime = new Date().getTime();
        lastPer += (stopTime - startTime) / (allTime * 1000);
    }
    root.pro = {
        renderAllTime: renderAllTime,
        start: start,
        stop: stop,
        updata: updata
    }
})(window.Zepto, window.player || (window.player = {}))