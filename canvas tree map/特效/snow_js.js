(function(exports, undefined){
    'use strict';
    var document = exports.document;
    function Snow(){
        this.colors = ['#fff'];
        this.balls = [];
        this.windDirection = -1;
        this.ballRadius = 3;
        this.ballsPerFrame = 2;
        this.timeInterval = 40;
        this.windDirectionChangedInterval = 5000;
        this.accumulativeTime = 0;
        return this;
    };
    exports.Snow = Snow;
    Snow.prototype = {
        init: function(args){
            for(var p in args){
                this[p] = args[p];
            }
            this.canvas = this.canvas || document.querySelector('#canvas');
            this.context = this.context || this.canvas.getContext('2d');
            this.canvasWidth = this.canvasWidth || document.body.offsetWidth || document.body.clientWidth;
            this.canvasHeight = this.canvasHeight || document.body.offsetHeight || document.body.clientHeight;
            this.canvas.width = this.canvasWidth;
            this.canvas.height = this.canvasHeight;
            return this;
        },
        start: function(){
            this.timer = this.timer || setTimeout(this.frame.bind(this), this.timeInterval);
            return this;
        },
        frame: function(){
            this.accumulativeTime += this.timeInterval;
            (this.accumulativeTime % this.windDirectionChangedInterval < this.timeInterval) && (this.windDirection *= -1);
            this.render.call(this);
            this.update.call(this);
            this.timer = null;
            this.timer = setTimeout(this.frame.bind(this), this.timeInterval);
        },
        update: function(){
            this.addBalls.call(this);
            this.updateBalls.call(this);
        },
        updateBalls: function(){
            var balls = this.balls,
                len = balls.length,
                i = 0,
                cnt = 0;
            for(;i<len;i++){
                balls[i].x += balls[i].vx * this.windDirection;
                balls[i].y += balls[i].vy;
                balls[i].vy += balls[i].g * balls[i].t;
                balls[i].t += this.timeInterval;
                if(balls[i].y - this.ballRadius < this.canvasHeight){
                    balls[cnt++] = balls[i];
                }
            }
            while(len>cnt){
                balls.pop();
                len--;
            }
        },
        addBalls: function(){
            var ball,
                i = 0,
                len = this.ballsPerFrame,
                _this = this;
            for(;i<len;i++){
                ball = {
                    x: Math.pow(-1, Math.ceil(Math.random() * 1000)) * Math.floor(Math.random() * _this.canvasWidth * 1.5),
                    y: Math.floor(Math.random() * this.ballRadius) * -1,
                    g: 0.00005,
                    vx: 1 + Math.floor(Math.random() * 2),
                    vy: 2 + Math.floor(Math.random() * 5),
                    t: 0,
                    color: _this.colors[Math.floor(Math.random() * _this.colors.length)]
                }
                this.balls.push(ball);
            }
        },
        render: function(){
            var cxt = this.context,
                i = 0,
                len = this.balls.length;
            cxt.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
            for(;i<len;i++){
                cxt.fillStyle = this.balls[i].color;
                cxt.beginPath();
                cxt.arc(this.balls[i].x, this.balls[i].y, this.ballRadius, 0, 2 * Math.PI, true);
                cxt.closePath();
                cxt.fill();
            }
        },
        pause: function(){
            clearTimeout(this.timer);
            this.timer = null;
        },
        resume: function(){
            this.start.call(this);
        },
        clear: function(){
            clearTimeout(this.timer);
            this.timer = null;
            this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        }
    }
})(window);
