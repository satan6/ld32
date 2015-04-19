Phaser.Filter.Game = function(game) {
	Phaser.Filter.call(this, game);

	this.uniforms.playerPos = { type: '2f', value: {x: 0, y: 0} };

	var src = game.cache.getText("gameshader");
	this.fragmentSrc = src.split('\n');
};

Phaser.Filter.Game.prototype = Object.create(Phaser.Filter.prototype);
Phaser.Filter.Game.prototype.constructor = Phaser.Filter.Game;