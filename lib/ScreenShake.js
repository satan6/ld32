Phaser.Plugin.ScreenShake = function(game, parent) {
	Phaser.Plugin.call(this, game, parent);

	this.dir = 1;
};

Phaser.Plugin.ScreenShake.prototype = Object.create(Phaser.Plugin.prototype);
Phaser.Plugin.ScreenShake.prototype.constructor = Phaser.Plugin.ScreenShake;

Phaser.Plugin.ScreenShake.prototype.shake = function(conf) {
	this.shakeFrom = this.game.time.now;
	this.shakeTill = this.game.time.now + conf.duration || 50;
	this.intensity = conf.intensity;
	this.random = conf.random;
	this.easing = conf.easing;
};

Phaser.Plugin.ScreenShake.prototype.postUpdate = function() {
	if(this.game.time.now < this.shakeTill) {
		var x = this.intensity.x,
			y = this.intensity.y;

		if(this.random) {
			x *= this.game.rnd.realInRange(-1, 1);
			y *= this.game.rnd.realInRange(-1, 1);
		} else {
			x *= this.dir;
			y *= this.dir;

			this.dir *= -1;
		}

		if(this.easing) {
			var progress = 1 - (this.game.time.now - this.shakeFrom) / (this.shakeTill - this.shakeFrom);

			x *= progress;
			y *= progress;
		}

		this.game.camera.x += x;
		this.game.camera.y += y;

		this.game.camera.displayObject.position.x = -this.game.camera.view.x;
		this.game.camera.displayObject.position.y = -this.game.camera.view.y;
	}
};