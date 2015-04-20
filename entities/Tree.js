var Tree = (function() {

	function Tree(x, y) {
		this.sprite = game.add.group(trees);
		this.sprite.position.setTo(x, y);
		this.sprite.fallTime = 0;
		
		this.stump = game.add.sprite(x, y, 'stump', 0, world);
		this.stump.anchor.setTo(0.5, 0.5);
		game.physics.p2.enable(this.stump);
		this.stump.body.setCircle(20);
		this.stump.body.static = true;

		this.splinters = game.add.emitter(0, 0, 30);
		this.sprite.addChild(this.splinters);
		this.splinters.gravity = 0;
		//this.splinters.emitX = 15;
		this.splinters.setAlpha(1, 0.3, 400);
		this.splinters.setRotation(1, 2);
		this.splinters.setScale(0.9, 0.2, 0.9, 0.2, 400);
		this.splinters.setXSpeed(-100, -250);
		this.splinters.setYSpeed(-200, 200);

    	this.splinters.makeParticles('splinter');

		this.treeShape = game.physics.p2.createBody(x, y, 0, false, {}, [0,13-32, 0,64-13-32, 190,64-16-32, 190,70+64-32, 670,30-32, 190,-70-32, 190,16-32]);
		this.treeShape.killsYou = true;
		this.treeShape.tree = this;

		this.stemShape = game.physics.p2.createBody(x, y, 0, false, {}, [0,13-32, 0,64-13-32, 670,30-32]);
		//this.stump.body.immovable = true;
		
		this.stump.inputEnabled = true;
		this.stump.events.onInputDown.add(function() {
			if(vec2.from(player.sprite.position).dist(this.sprite.position) < 85) {
				if(!this.didFall)
					this.splinters.start(true, 400, null, 30);

				player.chopSound.play();
				this.fall(Math.PI/2*3 - vec2.from(player.sprite.position).minus(new vec2(game.input.activePointer.worldX, game.input.activePointer.worldY)).angle());
			}
		}, this);

		this.stump.events.onInputOver.add(function() {
			if(this.didFall) return;
			this.indicator.visible = true;
			this.drawIndicator = true;
		}, this);

		this.stump.events.onInputOut.add(function() {
			if(this.didFall) return;
			this.indicator.visible = false;
			this.drawIndicator = false;
		}, this);

		this.fallingStuff = game.add.group(this.sprite);

		this.stemEnd = game.add.sprite(0, 0, 'stemEnd', 0, this.fallingStuff);
		this.stemEnd.anchor.setTo(0.5, 0.5);

		this.lowerBranches = game.add.group(this.fallingStuff);

		this.stem = game.add.sprite(0, 0, 'stem', 0, this.fallingStuff);
		this.stem.anchor.setTo(0, 0.5);
		this.stem.scale.x = 0.01;

		this.indicator = game.add.sprite(x, y, 'fall_indicator', 0);
		this.indicator.anchor.setTo(0.05, 0.5);
		this.indicator.visible = false;

		this.upperBranches = game.add.group(this.fallingStuff);

		for(var i = 0; i < 14; i++) {
			this.addBranch(0.3 + 0.07 * i * (40 - i) / 40, 1 - 0.06 * i + Math.random() * 0.2, Math.random() * 0.4 - 0.2);
		}

		this.sprite.ent = this;

		this.fallSound = game.add.sound("treefall");
		game.plugins.audio.adoptSound(this.fallSound, this.sprite.position, true);

		//this.fall(0);
	}

	Tree.prototype.addBranch = function(offset, scale, rot) {
		var alpha = 0.0;

		var branchesBot = game.add.sprite(0, 0, 'branches', 0, this.lowerBranches);
		branchesBot.anchor.setTo(0, 0.5);
		branchesBot.scale.setTo(scale, scale);
		branchesBot.branchOffset = offset;
		branchesBot.rotation = rot;
		branchesBot.alpha = alpha;

		branchesBot.animations.add('fall', [1, 3, 5, 7], 1);
		branchesBot.frame = 1;
		//branchesBot.animations.play("fall");

		/*var tweenBot = game.add.tween(branchesBot);
		tweenBot.to({
			alpha: 1
		}, 4000, Phaser.Easing.Quadratic.In, true);*/

		var branchesTop = game.add.sprite(0, 0, 'branches', 0, this.upperBranches);
		branchesTop.anchor.setTo(1, 0.5);
		branchesTop.scale.setTo(scale, scale);
		branchesTop.branchOffset = offset;
		branchesTop.rotation = rot;
		branchesTop.alpha = alpha;

		branchesTop.animations.add('fall', [0, 2, 4, 6], 1);
		//branchesTop.animations.play("fall");

		/*var tweenTop = game.add.tween(branchesTop);
		tweenTop.to({
			alpha: 1
		}, 4000, Phaser.Easing.Quadratic.In, true);*/
};

Tree.prototype.fall = function(dir) {
	if(this.didFall) return;
	this.didFall = true;
	this.drawIndicator = false;
	this.indicator.visible = false;
	this.sprite.fallTime = game.time.time;

	this.sprite.rotation = dir;
	this.treeShape.rotation = dir;
	this.stemShape.rotation = dir;

	var tweenTop = game.add.tween(this.fallingStuff);
	tweenTop.to({
		x: 26
	}, 4000, Phaser.Easing.Quadratic.In, true);

	var tweenTop = game.add.tween(this.stemEnd.scale);
	tweenTop.to({
		x: 0.5
	}, 4000, Phaser.Easing.Quadratic.In, true);

	var tweenTop = game.add.tween(this.stem.scale);
	tweenTop.to({
		x: 1
	}, 4000, Phaser.Easing.Quadratic.In, true);

	var timer = game.time.create();
	timer.add(3100, function() {
		game.physics.p2.addBody(this.treeShape);
		//this.treeShape.debug = true;
		this.treeShape.data.updateAABB(); // Please just kill me

		game.plugins.screenShake.shake({
			duration: 800,
			intensity: {
				x: 40,
				y: 60
			},
			random: true,
			easing: true
		});
	}, this);
	timer.add(4000, function() {
		game.physics.p2.removeBody(this.treeShape);
		//this.treeShape.debug = false;

		game.physics.p2.addBody(this.stemShape);
		this.stemShape.data.updateAABB();
		//this.stemShape.debug = true;
		
		if(onTreeChopped)
			onTreeChopped();
	}, this);
	timer.start();

	function startAnim(branch) {
		branch.animations.play("fall");
		game.add.tween(branch).to({
			alpha: 0.7
		}, 4000, Phaser.Easing.Quadratic.In, true);
	}

	this.lowerBranches.forEach(startAnim, this);
	this.upperBranches.forEach(startAnim, this);

	this.fallSound.play();
};

Tree.prototype.update = function() {
	if(this.drawIndicator) {
		var angle = Math.PI/2*3 - vec2.from(player.sprite.position).minus(new vec2(game.input.activePointer.worldX, game.input.activePointer.worldY)).angle();
		this.indicator.rotation = angle;

		if(vec2.from(player.sprite.position).dist(this.sprite.position) < 85)
			this.indicator.frame = 1;
		else
			this.indicator.frame = 0;
	}

	this.lowerBranches.forEach(function(branch) {
		branch.position.x = this.stem.width * branch.branchOffset;
	}, this);

	this.upperBranches.forEach(function(branch) {
		branch.position.x = this.stem.width * branch.branchOffset;
	}, this);

	//game.physics.arcade.collide(player.sprite, this.stump);
	//game.physics.arcade.collide(player.sprite, this.stem);
};

return Tree;

})();