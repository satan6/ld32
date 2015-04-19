var Story = (function() {

	var BAR_HEIGHT = 120;
	var BAR_TIME = 150;

	function Story(storyline, bars) {
		this.storyline = storyline;
		this.current = 0;
		this.hasBars = bars;
	}

	Story.prototype.start = function() {

		// Black Bars

		if(this.hasBars) {
			var darkness = game.add.bitmapData(game.width, BAR_HEIGHT);
			darkness.context.fillStyle = "black";
			darkness.context.fillRect(0, 0, game.width, BAR_HEIGHT);

			//this.topBar = game.add.sprite(0, -BAR_HEIGHT, darkness);
			//this.topBar.fixedToCamera = true;

			this.bottomBar = game.add.sprite(0, game.height, darkness);
			this.bottomBar.alpha = 0.7;
			this.bottomBar.fixedToCamera = true;

			//var tweenTop = game.add.tween(this.topBar.cameraOffset);
			//tweenTop.to({y: 0}, BAR_TIME).start();

			var tweenBot = game.add.tween(this.bottomBar.cameraOffset);
			tweenBot.onComplete.add(function() {
				this.allowInput = true;
				this.storyline[this.current].start(this);
				this.storyStarted = true;
			}, this);
			tweenBot.to({y: game.height - BAR_HEIGHT}, BAR_TIME).start();
		} else {
			this.allowInput = true;
			this.storyline[this.current].start(this);
			this.storyStarted = true;
		}


		this.info = game.add.text(game.width - 10, game.height - 10, 'SPACE to continue', {
			font: "12px Arial",
			fill: "#aaaaaa"
		});
		this.info.anchor.x = 1;
		this.info.anchor.y = 1;
		this.info.visible = false;
		this.info.fixedToCamera = true;

		this.wasDown = game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR);
		this.isActive = true;
		this.didPlay = true;
	};

	Story.prototype.update = function() {
		if(!this.isActive) throw "Stop calling me, its over";

		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
			if(!this.wasDown && this.allowInput) {
				this.next();
			}
			this.wasDown = true;
		} else this.wasDown = false;

		this.info.visible = this.allowInput;

		if(this.storyStarted) this.storyline[this.current].update();
	};

	Story.prototype.next = function() {
		this.storyline[this.current].stop();
		this.current++;
		if(this.current < this.storyline.length)
			this.storyline[this.current].start(this);
		else
			this.stop();
	};

	Story.prototype.stop = function() {
		if(this.hasBars) {
			//var tweenTop = game.add.tween(this.topBar.cameraOffset);
			//tweenTop.to({y: -BAR_HEIGHT}, BAR_TIME).start();

			var tweenBot = game.add.tween(this.bottomBar.cameraOffset);
			tweenBot.onComplete.add(function() {
				//this.topBar.destroy();
				this.bottomBar.destroy();
				this.isActive = false;
			}, this);
			tweenBot.to({y: game.height}, BAR_TIME).start();
		} else 
			this.isActive = false;

		this.info.destroy();

		this.allowInput = false;
		this.storyStarted = false;
	};

	Story.Text = function(str) {
		this.str = str;
	};

	Story.Text.prototype.start = function(story) {
		var offset = story.hasBars ? BAR_HEIGHT / 2 : 80;
		this.text = game.add.text(game.width/2, game.height - offset, this.str, {
			font: "300 26px Roboto",
			fill: "#ffffff"
		});

		this.text.setShadow(0, 0, "#000000", 10)

		this.text.anchor.x = 0.5;
		this.text.anchor.y = 0.5;
		this.text.fixedToCamera = true;

	};

	Story.Text.prototype.update = function() {

	};

	Story.Text.prototype.stop = function() {
		this.text.destroy();
	};

	Story.Speech = function(char, name, str, isRight) {
		this.char = char;
		this.name = name;
		this.str = str;
		this.isRight = isRight;
	};

	var SPEECH_PADDING = 25;

	Story.Speech.prototype.start = function(story) {
		var offset = story.hasBars ? BAR_HEIGHT / 2 : 80;

		if(this.isRight) {
			this.portrait = game.add.sprite(game.width - SPEECH_PADDING, game.height - 80, this.char);
			this.portrait.anchor.setTo(1, 1);
		} else {
			this.portrait = game.add.sprite(SPEECH_PADDING, game.height - 80, this.char);
			this.portrait.anchor.setTo(0, 1);
		}
		this.portrait.fixedToCamera = true;

		if(this.isRight) {
			this.nametag = game.add.text(game.width - SPEECH_PADDING - this.portrait.width/2, game.height - 40, this.name, {
				font: "300 20px Roboto",
				fill: "#ffffff"
			});
		} else {
			this.nametag = game.add.text(SPEECH_PADDING + this.portrait.width/2, game.height - 40, this.name, {
				font: "300 20px Roboto",
				fill: "#ffffff"
			});
		}
		this.nametag.anchor.setTo(0.5, 1);
		this.nametag.fixedToCamera = true;

		this.text = game.add.text(game.width/2, game.height - offset, this.str, {
			font: "300 26px Roboto",
			fill: "#ffffff"
		});

		this.text.setShadow(0, 0, "#000000", 10)

		this.text.anchor.x = 0.5;
		this.text.anchor.y = 0.5;
		this.text.fixedToCamera = true;
	};

	Story.Speech.prototype.update = function() {

	};

	Story.Speech.prototype.stop = function() {
		this.portrait.destroy();
		this.nametag.destroy();
		this.text.destroy();
	};

	Story.Nop = function() {};
	Story.Nop.prototype.start = function() {};
	Story.Nop.prototype.update = function() {};
	Story.Nop.prototype.stop = function() {};

	Story.Fn = function(fn, ctx) {
		this.fn = fn.bind(ctx);
	};
	Story.Fn.prototype.start = function(story) {
		this.fn(story.next.bind(story));
	};
	Story.Fn.prototype.update = function() {};
	Story.Fn.prototype.stop = function() {};

	Story.Transition = function(obj, to, duration, allowSkip) {
		this.obj = obj;
		this.to = to;
		this.duration = duration;
		this.allowSkip = allowSkip;
	};

	Story.Transition.prototype.start = function(story) {
		this.tween = game.add.tween(this.obj);
		this.tween.onComplete.add(function() {
			story.allowInput = true;
			story.next();
		}, this);
		this.tween.to(this.to, this.delay).start();
		if(!this.allowSkip)
			story.allowInput = false;
	};

	Story.Transition.prototype.update = function() {};

	Story.Transition.prototype.stop = function() {
		if(this.tween.isRunning) {
			this.tween.stop();
			for(var prop in this.to) {
				this.obj[prop] = this.to[prop];
			}
		}
	};

	return Story;
})();