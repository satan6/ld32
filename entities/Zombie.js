var Zombie = (function() {

	var SPEED = 50;
	var CHASE_SPEED = 100;

	function Zombie(x, y) {
		this.isAlive = true;
		this.sprite = game.add.sprite(x, y, 'zombie', 0, zombies);
		this.sprite.anchor.setTo(0.5, 0.5);
		game.physics.p2.enable(this.sprite);
		this.sprite.body.setCircle(16, true);
		this.sprite.body.rotation = Math.random() * 2 * Math.PI;

		this.sprite.body.onBeginContact.add(function(body) {
			if(!body) return this.didCollide = true; // worlds bounds or some shit

			if(body.sprite && body.sprite.ent == player) {
				game.state.start("gameover", true);
			} else if(body.killsYou) {
				console.log("zombie deaded");
				this.kill();
			} else
				this.didCollide = true;
		}, this);

		//this.sprite.animations.add('walk', [5, 6], 6);
		//this.sprite.animations.add('undie', [0, 1, 2, 3, 4], 10);

		this.sprite.ent = this;
	}

	Zombie.prototype.update = function() {
		if(this.isAlive) {
			//var dir = vec2.from(player.sprite.position).minus(this.sprite.position);
			//this.sprite.rotation = Math.PI - dir.angle();
			
			/*var groupSum = new vec2(0, 0);

			zombies.forEach(function(sprite) {
				var dir = new vec2(100, 0);

				var closeness = Math.max(0, 100 - vec2.from(this.sprite.position).dist(sprite.position)) / 100;
				groupSum = groupSum.plus(vec2.from(sprite.position).plus(dir.rot(sprite.body.rotation).times(closeness)));
			}, this);

			var angle = Math.PI/2 - groupSum.minus(this.sprite.position).angle();
			var rd = Rad.shorterCW(this.sprite.body.rotation, angle) ? -1 : 1;

			this.sprite.body.rotation += rd * 0.2;*/
			this.sprite.body.setZeroRotation();

			if(vec2.from(this.sprite.position).dist(player.sprite.position) < 100) {
				this.sprite.body.rotation = Math.PI - vec2.from(player.sprite.position).minus(this.sprite.position).angle();
				this.sprite.body.moveForward(CHASE_SPEED);
			} else if(timer.isRinging && vec2.from(this.sprite.position).dist(timer.sprite.position) < 666) {
				if(vec2.from(this.sprite.position).dist(timer.sprite.position) < 30) {
					this.sprite.body.rotation = Math.PI - vec2.from(timer.sprite.position).minus(this.sprite.position).angle();
					this.sprite.body.moveForward(SPEED * 0.1);
				} else {
					this.sprite.body.rotation = Math.PI - vec2.from(timer.sprite.position).minus(this.sprite.position).angle();
					this.sprite.body.moveForward(SPEED);
				}
			} else {
				if(this.didCollide)
					this.sprite.body.rotation += Math.PI;
				else {
					this.sprite.body.rotation += (Math.random() * 0.1 - 0.05);
				}

				this.sprite.body.moveForward(SPEED);
			}

			this.didCollide = false;
		}
	};

	Zombie.prototype.kill = function() {
		game.physics.p2.removeBody(this.sprite.body);
		this.sprite.destroy();
		var corpse = game.add.sprite(this.sprite.position.x, this.sprite.position.y, "zombie_dead", 0, corpses);
		corpse.anchor.setTo(0.5, 0.8);
		corpse.rotation = this.sprite.rotation + Math.PI;
		this.isAlive = false;

		var oneAlive = false;
		zombies.forEach(function(sprite) {
			if(sprite.ent.isAlive)
				oneAlive = true;
		});
		if(!oneAlive)
			isWin = true;
	};

	return Zombie;

})();