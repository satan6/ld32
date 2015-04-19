var Player = (function() {

	var SPEED = 100;
	var SWING_SPEED = 0.5;

	function Player(x, y) {
		this.isSwinging = false;
		this.swingLeft = 0;
		this.mouseWasDown = false;
		this.sprite = game.add.sprite(x, y, 'player', 0, world);
		this.sprite.anchor.setTo(0.5, 0.5);
		game.physics.p2.enable(this.sprite);
		this.sprite.body.setCircle(16);

		this.axe = game.make.sprite(0, -10, 'axe', 0);
		this.axe.anchor.setTo(0.3, 0.7);
		this.sprite.addChild(this.axe)
		
		/*this.axeShape = game.physics.p2.createBody(x, y-10, 0, false, {}, [30,-16, 50,-16, 50,0, 30,0]);
		this.axeShape.killsYou = true;
		this.axeShape.debug = true;
		this.axeShape.static = true;

		game.physics.p2.addBody(this.axeShape);
		this.axeShape.data.updateAABB();*/

		//this.axe.body.setCircle(16);
		
		//this.sprite.body.collideWorldBounds = true;
		//this.sprite.body.maxVelocity = MAX_SPEED;

		//this.sprite.animations.add('walk', [0, 1, 2, 3, 2, 1], 12);
		//this.sprite.animations.add('shoot', [5, 5], 10);

		this.sprite.ent = this;

		this.swing = game.add.sound("axe_swing");
		game.plugins.audio.adoptSound(this.swing, this.sprite.position, true);

	}

	Player.prototype.update = function() {

		//this.axeShape.x = this.sprite.position.x;
		//this.axeShape.y = this.sprite.position.y - 10;

		// Input handling
		if(this.isSwinging) {
			this.swingLeft -= SWING_SPEED;
			this.axe.rotation -= SWING_SPEED;
			if(this.swingLeft <= 0) {
				this.axe.rotation = 0;
				this.isSwinging = false;
			}
		}

		var dir = (new vec2(game.input.activePointer.worldX, game.input.activePointer.worldY)).minus(player.sprite.position).norm().times(SPEED);
		var right = dir.rot(Math.PI/2);

		player.sprite.body.setZeroVelocity();

		if(game.input.keyboard.isDown(Phaser.Keyboard.W)) {
			player.sprite.body.moveUp(SPEED);
		} else if(game.input.keyboard.isDown(Phaser.Keyboard.S)) {
			player.sprite.body.moveDown(SPEED);
		}

		if(game.input.keyboard.isDown(Phaser.Keyboard.A)) {
			player.sprite.body.moveLeft(SPEED);
		} else if(game.input.keyboard.isDown(Phaser.Keyboard.D)) {
			player.sprite.body.moveRight(SPEED);
		}

		player.sprite.body.rotation = Math.PI - dir.angle();

		if(game.input.activePointer.isDown) {
			if(!this.mouseWasDown && !this.isSwinging) {
				this.isSwinging = true;
				this.swingLeft = Math.PI * 2;
				this.swing.play();

				
				var axeCenter = vec2.from(this.sprite.position).plus(dir.norm().times(10));

				var fuckEverything = true;

				while(fuckEverything) {
					fuckEverything = false;
					zombies.forEach(function(sprite) {
						if(axeCenter.dist(sprite.position) < 70) {
							sprite.ent.kill(); // it fucks shit up when we destroy things
							fuckEverything = true;
						}
					}, this);
				}
			}

			this.mouseWasDown = true;
		} else this.mouseWasDown = false;
	};


	return Player;

})();