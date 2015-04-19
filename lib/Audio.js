Phaser.Plugin.Audio = function(game, parent) {
	Phaser.Plugin.call(this, game, parent);

	this.ctx = game.sound.context;

	this.in = this.ctx.createGain();

	var compressor = this.ctx.createDynamicsCompressor();
	compressor.connect(game.sound.masterGain);
	this.out = compressor;

	this.in.connect(this.out);

	this.updateSounds = [];
};

Phaser.Plugin.Audio.prototype = Object.create(Phaser.Plugin.prototype);
Phaser.Plugin.Audio.prototype.constructor = Phaser.Plugin.Audio;

Phaser.Plugin.Audio.setPannerPosition = function(panner, position) {
	var dx = position.x - game.camera.x - game.camera.width / 2;
	var dy = position.y - game.camera.y - game.camera.height / 2;

	panner.setPosition(dx / (game.camera.width), -dy / (game.camera.height), -1);
};

Phaser.Plugin.Audio.prototype.adoptSound = function(sound, position, keepUpdated) {
	sound.gainNode.disconnect(this.game.sound.masterGain);
	sound.gainNode.connect(this.in);

	if(position) {
		var panner = sound.context.createPanner();
		panner.panningModel = 'equalpower'; // Firefox wants this

		sound.externalNode = panner;
		panner.connect(sound.gainNode);

		Phaser.Plugin.Audio.setPannerPosition(panner, position);

		if(keepUpdated) {
			function update() {
				Phaser.Plugin.Audio.setPannerPosition(panner, position, position);
			}

			sound.onPlay.add(function() {
				this.updateSounds.push(update);
			}, this);

			sound.onStop.add(function() {
				this.updateSounds.splice(this.updateSounds.indexOf(update), 1);
			}, this);
		}
	}
};

Phaser.Plugin.Audio.prototype.update = function() {
	for(var i in this.updateSounds) {
		this.updateSounds[i]();
	}
};