var Timer = (function() {

	function Timer() {
		this.isPlaced = false;
		this.isRinging = false;
		this.sprite = game.make.sprite(0, 0, "timer", 0, world);
		this.sprite.anchor.set(0.5, 0.5);
		this.sprite.scale.set(0.5, 0.5);
		this.icon = game.add.sprite(WIDTH - 40, 40, "timer", 0, world);
		this.icon.fixedToCamera = true;
		this.icon.anchor.set(1, 0);

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
	}

	Timer.prototype.update = function() {
		if(this.isPlaced && vec2.from(this.sprite.position).dist(player.sprite.position) < 50) {
			this.isPlaced = false;
			this.isRinging = false;
			this.icon.visible = true;
			this.ring.stop();
			this.tick.stop();
			game.world.remove(this.sprite);
			this.timer.stop(true);
			this.pickup.play();
		}

		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && !this.isPlaced) {
			this.sprite.position.setTo(game.input.activePointer.worldX, game.input.activePointer.worldY);
			game.add.existing(this.sprite);
			this.isPlaced = true;
			this.tick.play();
			this.icon.visible = false;

			this.timer = game.time.create();

			this.timer.add(5000, function() {
				this.tick.stop();
				this.ring.play();
				this.isRinging = true;
			}, this);

			this.timer.add(13000, function() {
				this.ring.stop();
				this.isRinging = false;
			}, this);

			this.timer.start();
		}
	};

	return Timer;

})();