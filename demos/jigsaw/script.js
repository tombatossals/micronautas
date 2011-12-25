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

var Jigsaw = function(screen) {
	this.img_url = "sunflower.jpg";
	this.screen = screen;
	this.canvas = screen.querySelector("canvas");
	this.ctx = this.canvas.getContext("2d");
    this.img = false;
    this.canvas_width = this.canvas.width;
    this.canvas_height = this.canvas.height;

    document.addEventListener('mozfullscreenchange', this.on_fullscreen_change.bind(this));
    document.addEventListener('webkitfullscreenchange', this.on_fullscreen_change.bind(this));
};

Jigsaw.prototype = {

	start: function() {
		var img = new Image();
        this.img = img;
        var jigsaw = this;
		img.onload = function() {
			jigsaw.draw();
		};
		img.src = this.img_url;
	}, 

    draw: function() {
            var canvas_ratio = this.canvas.width/this.canvas.height;

            if (canvas_ratio > 1) {
                var width = this.img.width;
                var height = this.canvas.height*this.img.width/this.canvas.width;
            } else {
                var height = this.canvas.height;
                var width = this.canvas.width*this.img.height/this.canvas.height;
            }
           

			this.ctx.drawImage(this.img, (this.img.width - width)/2, (this.img.height - height)/2, width, height, 0, 0, this.canvas.width, this.canvas.height);
    },
   
    toggle_fullscreen: function() {
        if ((document.fullScreenElement && document.fullScreenElement !== null) ||
            (!document.mozFullScreen && !document.webkitIsFullScreen)) {
            if (this.screen.requestFullScreen) {
                this.screen.requestFullScreen();
            } else if (this.screen.mozRequestFullScreen) {
                this.screen.mozRequestFullScreen();
            } else if (this.screen.webkitRequestFullScreen) {
                this.screen.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
            }
        } else {
            if (document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
        }
        this.draw();
    },

    // fullscreen event
    on_fullscreen_change: function() {
        if(document.FullScreen || document.mozFullScreen || document.webkitIsFullScreen) {
            var rect = this.canvas.getBoundingClientRect();
            this.canvas.width = rect.width;
            this.canvas.height = rect.height;
        } else {
            this.canvas.width = this.canvas_width;
            this.canvas.height = this.canvas_height;
        }
        console.log("hola");
        this.draw();
    }
};

(function() {
    window.onload = function() {
	    jigsaw = new Jigsaw(document.getElementById("screen"));
	    jigsaw.start();
        document.querySelector('button').addEventListener('click', jigsaw.toggle_fullscreen.bind(jigsaw));
    }
})();
