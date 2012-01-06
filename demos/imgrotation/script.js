var stats;
document.cancelFullScreen = document.webkitCancelFullScreen || document.mozCancelFullScreen;

window.requestAnimFrame = (function() {
	return window.requestAnimationFrame || 
	window.webkitRequestAnimationFrame  || 
	window.mozRequestAnimationFrame     || 
	window.oRequestAnimationFrame       || 
	window.msRequestAnimationFrame      || 
	function(/* function */ callback, /* DOMElement */ element){
		window.setTimeout(callback, 1000 / 60);
	};
})();

var Canvas = function(screen) {
	var img_url = "sun.jpg";

	this.img = new Image();
    var c = this;
	this.img.onload = function() {
		c.animate();
	};
	this.img.src = img_url;

	this.screen = screen;
    canvas.setAttribute('width', '300');
    canvas.setAttribute('height', '200');
	this.ctx = canvas.getContext("2d");

    this.speed = 1;
    this.offsetX = 0;
    this.rotation_step = Math.PI/180;
    this.rotation = 0;

    this.screen.onwebkitfullscreenchange = this.onFullScreenEnter.bind(this);
    this.screen.onmozfullscreenchange = this.onFullScreenEnter.bind(this);

};

Canvas.prototype = {

    draw: function() {
            var canvas_width = this.ctx.canvas.width;
            var canvas_height = this.ctx.canvas.height;
            var canvas_ratio = canvas_width/canvas_height;

            if (canvas_ratio >= 1) {
                var height = canvas_height;
                var width = canvas_height*this.img.width/this.img.height;
                var offsetX = (canvas_width - width)/2;
                var offsetY = (canvas_height - height)/2;
            } else {
                var height = canvas_height;
                var width = canvas_width*this.img.height/canvas_height;
            }
            this.ctx.save();
            this.ctx.translate(width/2 + offsetX, height/2 + offsetY);
            this.ctx.rotate(this.rotation);
            this.ctx.translate(-width/2 - offsetX, -height/2 - offsetY);
			this.ctx.drawImage(this.img, 0, 0, this.img.width, this.img.height, offsetX, offsetY, width, height);
            this.rotation += this.rotation_step;
            this.ctx.restore();

    },

    animate: function() {
        window.requestAnimFrame( this.animate.bind(this) );
        this.draw();
        stats.update();
    },
   
    // fullscreen enter event
    onFullScreenEnter: function(e) {
        this.screen.onwebkitfullscreenchange = this.onFullScreenExit.bind(this);
        this.screen.onmozfullscreenchange = this.onFullScreenExit.bind(this);
    },

    // fullscreen exit event
    onFullScreenExit: function(e) {
        console.log("exit fullscreen");
        document.querySelector('button').onclick = this.enterFullScreen.bind(this);
    },

    // Note: FF nightly needs about:config full-screen-api.enabled set to true.
    enterFullScreen: function() {
        console.log("enterFullscreen()");
        this.screen.onwebkitfullscreenchange = this.onFullScreenEnter.bind(this);
        this.screen.onmozfullscreenchange = this.onFullScreenEnter.bind(this);
        if (this.screen.webkitRequestFullScreen) {
            this.screen.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        } else {
            this.screen.mozRequestFullScreen();
        }
        document.querySelector('button').onclick = this.exitFullScreen.bind(this);
    },

    exitFullScreen: function() {
        console.log("exitFullscreen()");
        document.cancelFullScreen();
        document.querySelector('button').onclick = this.enterFullScreen.bind(this);
    },

};

(function() {
    window.onload = function() {
	    canvas = new Canvas(document.getElementById("screen"));
        document.querySelector('button').onclick = canvas.enterFullScreen.bind(canvas);

        stats = new Stats();
        document.querySelector("div#stats").appendChild( stats.domElement );
    }
})();
