(function (root) {
    function Index(len) {
        this.index = 0; //当前的索引值
        this.len = len; //数据的长度，用于判断
    }

    Index.prototype = {
        // 这个方法用于来取上一个索引（切换上一首）
        prev: function () {
            return this.get(-1);
        },

        next: function () {
            // 切换到下一首
            return this.get(1);
        },

        get: function (val) {
            this.index = (this.index + val + this.len) % this.len;
            return this.index;
        }
    }

    root.controlIndex = Index; //把构造函数暴露出去，因为实例对象需要传参
})(window.player || (window.player = {}))