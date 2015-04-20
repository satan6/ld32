var Zombie = (function() {

	var SPEED = 50;
	var CHASE_SPEED = 150;

	var IDLE = 0;
	var CHASING = 1;
	var INVESTIGATING = 2;

	function Zombie(x, y) {
		this.isAlive = true;
		this.state = IDLE;
		this.sprite = game.add.sprite(x, y, 'zombie', 0, zombies);
		this.sprite.anchor.setTo(0.5, 0.5);
		game.physics.p2.enable(this.sprite);
		this.sprite.body.setCircle(16, true);
		this.sprite.body.rotation = Math.random() * 2 * Math.PI;
		this.sprite.body.isZombie = true;

		this.sprite.body.onBeginContact.add(function(body) {
			if(!body) return this.didCollide = true; // worlds bounds or some shit

			if(body.sprite && body.sprite.ent == player) {
				game.state.start("gameover", true);
			} else if(body.killsYou) {
				console.log("zombie deaded");
				var d = vec2.from(this.sprite.position).dist(body.tree.sprite.position);
				this.kill(d/640 * 1000);
			} else if(!body.isZombie)
				this.didCollide = true;
		}, this);

		//this.sprite.animations.add('walk', [5, 6], 6);
		//this.sprite.animations.add('undie', [0, 1, 2, 3, 4], 10);
		//
		this.confused = game.add.sound("zombie_confused");
		game.plugins.audio.adoptSound(this.confused, this.sprite.position, true);

		this.attack = game.add.sound("zombie_attack");
		game.plugins.audio.adoptSound(this.attack, this.sprite.position, true);

		this.die = game.add.sound("zombie_die");
		game.plugins.audio.adoptSound(this.die, this.sprite.position, true);

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

			if(vec2.from(this.sprite.position).dist(player.sprite.position) < 150) {
				this.sprite.body.rotation = Math.PI - vec2.from(player.sprite.position).minus(this.sprite.position).angle();
				this.sprite.body.moveForward(CHASE_SPEED);

				if(this.state != CHASING)
					this.attack.play();

				this.state = CHASING;
			} else if(timer.isRinging && vec2.from(this.sprite.position).dist(timer.sprite.position) < 666) {
				if(vec2.from(this.sprite.position).dist(timer.sprite.position) < 30) {
					this.sprite.body.rotation = Math.PI - vec2.from(timer.sprite.position).minus(this.sprite.position).angle();
					this.sprite.body.moveForward(SPEED * 0.1);
				} else {
					this.sprite.body.rotation = Math.PI - vec2.from(timer.sprite.position).minus(this.sprite.position).angle();
					this.sprite.body.moveForward(SPEED);
				}

				if(this.state != INVESTIGATING)
					this.confused.play();

				this.state = INVESTIGATING;
			} else {
				if(this.didCollide)
					this.sprite.body.rotation += Math.PI;
				else {
					this.sprite.body.rotation += (Math.random() * 0.1 - 0.05);
				}

				this.sprite.body.moveForward(SPEED);

				this.state = IDLE;
			}

			this.didCollide = false;
		}
	};

	Zombie.prototype.startSplatter = function() {
		this.splatter = game.add.emitter(0, 0, 30);
		this.splatter.gravity = 0;
		this.splatter.setAlpha(1, 0.2, 400);
		this.splatter.setRotation(1, 2);
		this.splatter.setScale(0.9, 0.3, 0.9, 0.3, 400);
		this.splatter.setXSpeed(100, -250);
		this.splatter.setYSpeed(-150, 150);
    	this.splatter.makeParticles('blood');
		this.splatter.position.x = this.sprite.position.x;
		this.splatter.position.y = this.sprite.position.y;
		this.splatter.rotation = this.sprite.rotation - Math.PI/2;
		this.splatter.start(true, 400, null, 30);

		this.die.play();

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

	Zombie.prototype.kill = function(delay) {
		this.attack.stop();
		this.confused.stop();

		game.physics.p2.removeBody(this.sprite.body);
		if(delay) {
			var timer = game.time.create();
			timer.add(delay, function() {
				this.startSplatter();
			}, this);
			timer.start();
		} else {
			this.startSplatter();
		}
	};

	return Zombie;

})();