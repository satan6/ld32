Phaser.Filter.BSOD = function(game) {
	Phaser.Filter.call(this, game);

	var src = game.cache.getText("bsodshader");
	this.fragmentSrc = src.split('\n');
};

Phaser.Filter.BSOD.prototype = Object.create(Phaser.Filter.prototype);
Phaser.Filter.BSOD.prototype.constructor = Phaser.Filter.BSOD;