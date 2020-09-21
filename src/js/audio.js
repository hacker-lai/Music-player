(function(root){
    function AudioManage() {
        this.audio = new Audio(); //创建一个audio实例对象
        this.status = 'pause';
    }

    AudioManage.prototype = {
        
        load(src) { //加载音乐
            this.audio.src = src; //设置音乐的路径
            this.audio.load(); //加载音乐
        },

        //播放音乐
        play() {
            this.audio.play();
            this.status = 'play';
        }, 

        // 暂停播放
        pause() {
            this.audio.pause();
            this.status = 'pause';
        },

        // 音乐播放完成事件
        end(fn) {
            this.audio.onended = fn;
        },

        //跳到音乐的某个时间点
        playTo(time){
            this.audio.currentTime=time
        }
    }

    root.music = new AudioManage(); //把实例对象跑出去
})(window.player || (window.player = {}));