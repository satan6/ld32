var Timer = (function() {

	function Timer() {
		this.isPlaced = false;
		this.isRinging = false;
		this.isEnabled = false;
		this.sprite = game.make.sprite(0, 0, "timer", 0, world);
		this.sprite.anchor.set(0.5, 0.5);
		this.sprite.scale.set(0.5, 0.5);
		this.icon = game.add.sprite(WIDTH - 40, 40, "timer", 0);
		this.icon.fixedToCamera = true;
		this.icon.anchor.set(1, 0);
		this.icon.visible = false;

		this.sprite.ent = this;

		this.ring = game.add.sound("ring_loop");
		this.ring.loop = true;
		this.ring.volume = 0.3;
		game.plugins.audio.adoptSound(this.ring, this.sprite.position, true);

		this.tick = game.add.sound("tick_loop");
		this.tick.loop = true;
		game.plugins.audio.adoptSound(this.tick, this.sprite.position, true);

		this.pickup = game.add.sound("pickup");
		game.plugins.audio.adoptSound(this.pickup, this.sprite.position, true);

		this.fly = game.add.sound("axe_swing");
		game.plugins.audio.adoptSound(this.fly, this.sprite.position, true);
	}

	Timer.prototype.enable = function() {
		this.icon.visible = true;
		this.isEnabled = true;
	};

	Timer.prototype.update = function() {
		if(this.isPlaced && this.isLanded && vec2.from(this.sprite.position).dist(player.sprite.position) < 50) {
			this.isPlaced = false;
			this.isRinging = false;
			this.icon.visible = true;
			this.ring.stop();
			this.tick.stop();
			game.world.remove(this.sprite);
			this.timer.stop(true);
			this.pickup.play();
		}

		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && !this.isPlaced && this.isEnabled) {
			this.fly.play();

			this.sprite.position.setTo(player.sprite.position.x, player.sprite.position.y);
			game.add.existing(this.sprite);

			var airTime = (new vec2(game.input.activePointer.worldX, game.input.activePointer.worldY)).dist(this.sprite.position) / 100 * 100;

			game.add.tween(this.sprite.position).to({
				x: game.input.activePointer.worldX,
				y: game.input.activePointer.worldY
			}, airTime, Phaser.Easing.Linear.None, true);

			game.add.tween(this.sprite.scale).to({
				x: 0.8,
				y: 0.8
			}, airTime/2, Phaser.Easing.Quadratic.Out, true, 0, 0, true);

			/*game.add.tween(this.sprite.scale).to({
				x: 0.5,
				y: 0.5
			}, 400, Phaser.Easing.Quadratic.Out, true, 400);*/

			this.isPlaced = true;
			this.tick.play();
			this.icon.visible = false;

			this.timer = game.time.create();

			this.isLanded = false;
			this.timer.add(airTime, function() {
				this.isLanded = true;
			}, this);

			this.timer.add(4000, function() {
				this.tick.stop();
				this.ring.play();
				this.isRinging = true;
				if(onTimerRing)
					onTimerRing();
			}, this);

			this.timer.add(16000, function() {
				this.ring.stop();
				this.isRinging = false;
			}, this);

			this.timer.start();
		}
	};

	return Timer;

})();