(function ($, player) {
    function MusicPlayer(dom) {
        this.wrap = dom; //播放器的容器（用于加载listControl模块）
        this.dateList = [];
        // this.nowList = 0;
        this.rotateTimer = null;
        this.indexObj = null;
        this.list = null;
        this.curIndex = null; //当前播放歌曲的索引

        this.progress = player.progress.pro();
    }

    MusicPlayer.prototype = {
        init() { //初始化
            this.getDom();
            this.getDate('../mock/data.json'); //请求数据
        },

        getDom() { //获取页面内的元素
            this.record = document.querySelector('.songImg img'); //旋转图片
            this.controlBtns = document.querySelectorAll('.control li');
        },

        getDate(url) {
            var This = this;
            $.ajax({
                url: url,
                method: 'get',
                success: function (data) {
                    This.dateList = data;
                    // console.log(data);
                    This.listPlay();

                    This.indexObj = new player.controlIndex(data.length);


                    This.loadMusic(This.indexObj.index); //加载音乐
                    This.musicControl()

                },
                error: function () {
                    console.log("数据请求失败")
                }
            });
        },

        loadMusic(index) { //加载音乐
            player.render(this.dateList[index]); //渲染图片，歌曲信息
            player.music.load(this.dateList[index].audioSrc);

            this.progress.renderAllTime(this.dateList[index].duration);

            if (player.music.status == 'play') {
                player.music.play();
                this.controlBtns[2].className = 'playing';
                this.imgRotate(0);

                this.progress.move(0);
            }

            this.list.changeSelect(index);
            this.curIndex = index;
        },

        musicControl() { //控制音乐(上一首、下一首)
            var This = this;
            // 上一首
            this.controlBtns[1].addEventListener('touchend', function () {
                player.music.status = 'play';
                This.loadMusic(This.indexObj.prev());
            })

            // 播放、暂停
            this.controlBtns[2].addEventListener('touchend', function () {
                if (player.music.status == 'play') {
                    player.music.pause();
                    this.className = '';
                    This.imgStop();

                    This.progress.stop();
                } else {
                    player.music.play();
                    this.className = 'playing'

                    var deg = This.record.dataset.rotate || 0;
                    This.imgRotate(deg);
                    This.progress.move();
                }
            })

            // 下一首
            this.controlBtns[3].addEventListener('touchend', function () {
                player.music.status = 'play';
                This.loadMusic(This.indexObj.next());
            })
        },

        imgRotate(deg) {
            var This = this;
            clearInterval(this.rotateTimer);

            this.rotateTimer = setInterval(function () {
                deg = +deg + 0.3;

                This.record.style.transform = 'rotate(' + deg + 'deg)';
                This.record.dataset.rotate = deg;
            }, 1000 / 60);
        },

        imgStop() {
            clearInterval(this.rotateTimer);
        },

        listPlay: function () {
            var This = this;

            this.list = player.listControl(this.dateList, this.wrap);

            // 给列表添加点击事件
            this.controlBtns[4].addEventListener('touchend', function() {
                This.list.slideUp();
            })

            // 歌曲列表添加事件
            this.list.musicList.forEach(function(item, index) {
                item.addEventListener('touchend', function() {
                    // 如果点击的是当前那首歌，不管它是播放还是暂停都无效
                    if(This.curIndex == index) {
                        return;
                    }

                    player.music.status = 'play';
                    This.indexObj.index = index;
                    This.loadMusic(index);
                    This.list.slideDown();
                })
            })
        },
    }

    var musicPlayer = new MusicPlayer(document.getElementById('wrap'));
    musicPlayer.init();




})(window.Zepto, window.player);