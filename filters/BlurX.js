/**
* A horizontal blur filter by Mat Groves http://matgroves.com/ @Doormat23
*/
Phaser.Filter.BlurX = function (game) {

    Phaser.Filter.call(this, game);

      this.uniforms.playerPos = { type: '2f', value: {x: 0, y: 0} };

  var src = game.cache.getText("gameshader");
  this.fragmentSrc = src.split('\n');


};

Phaser.Filter.BlurX.prototype = Object.create(Phaser.Filter.prototype);
Phaser.Filter.BlurX.prototype.constructor = Phaser.Filter.BlurX;
