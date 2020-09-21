(function (root) {
    function Progress() {
        this.durTime = 0; //存储总时间
        this.frameId = null; //定时器
        this.startTime = 0; //开始播放的时间
        this.lastPercent = 0; //上次已经走的百分比

        this.init();
    }

    Progress.prototype = {
        init: function () {
            this.getDom();
        },

        getDom: function () {
            this.curTime = document.querySelector('.curTime');
            this.circle = document.querySelector('.circle');
            this.frontBg = document.querySelector('.frontBg');
            this.totalTime = document.querySelector('.totalTime');
        },

        // 渲染总时间
        renderAllTime: function (time) {
            this.durTime = time; //更新总时间
            time = this.formatTime(time);
            this.totalTime.innerHTML = time;
        },

        formatTime: function (time) {
            time = Math.round(time);
            var m = Math.floor(time / 60);
            var s = time % 60;
            
            m = m < 10 ? '0' + m : m;
            s = s < 10 ? '0' + s : s;

            return m + ':' + s;
        },

        move: function (per) {
            var This = this;
            this.lastPercent = per === undefined ? this.lastPercent : per;
            cancelAnimationFrame(this.frameId);
            this.startTime = new Date().getTime();
            // 计算时间与进度条的百分比
            function frame() {
				var curTime = new Date().getTime();

				//当前歌曲播放的百分比，考虑到暂停后播放，所以需要加上上次播放的百分比
				var per = This.lastPercent + (curTime - This.startTime) / (This.durTime * 1000);

				if (per <= 1) {
					//这个条件成立说明，当前歌曲还没有播放完
					This.update(per);
				} else {
					cancelAnimationFrame(This.frameId);
				}

				This.frameId = requestAnimationFrame(frame);
			}

			frame();
        },

        update: function (per) {
			//console.log('update');

			//更新左侧时间
			var time = this.formatTime(per * this.durTime);
			this.curTime.innerHTML = time;


			//更新进度条位置
			this.frontBg.style.width = per * 100 + '%';


			//更新圆点位置
			var l = per * this.circle.parentNode.offsetWidth;
			this.circle.style.transform = 'translateX(' + l + 'px)';
        },
        stop: function () {
            cancelAnimationFrame(this.frameId);

            var stopTime = new Date().getTime();

            this.lastPercent += (stopTime - this.startTime) / (this.durTime * 1000);
        }
    }

    function instanceProgress() {
        return new Progress();
    }

    root.progress = {
        pro: instanceProgress
    }
})(window.player || (window.player = {}))