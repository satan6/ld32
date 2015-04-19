var KeyboardDisplay = (function(){


var SIZE = 30;
var DIST = 35;
var SPACING = 100;

function KeyboardDisplay(game, x, y) {
    Phaser.Graphics.call(this, game, x, y);
}

KeyboardDisplay.prototype = Object.create(Phaser.Graphics.prototype);

KeyboardDisplay.prototype.drawKey = function(x, y, caption, isDown) {
    this.beginFill(isDown ? 0x773333 : 0xaaaaaa);
    this.drawRoundedRect(x - SIZE/2, y - SIZE/2, SIZE, SIZE, 5);
    var button = new Phaser.Text(game, x, y, caption, { font: '13px Arial', fill: isDown ? '#ffffff' : '#000000'});
    button.anchor.x = 0.5;
    button.anchor.y = 0.5;
    this.addChild(button);
    return button;
};

KeyboardDisplay.prototype.update = function() {
    this.clear();

    var child;
    while(child = this.children[0]) {
        child.destroy();
    }

    this.drawKey(0, -DIST, "W", game.input.keyboard.isDown(Phaser.Keyboard.W));
    this.drawKey(-DIST, 0, "A", game.input.keyboard.isDown(Phaser.Keyboard.A));
    this.drawKey(0, 0, "S", game.input.keyboard.isDown(Phaser.Keyboard.S));
    this.drawKey(DIST, 0, "D", game.input.keyboard.isDown(Phaser.Keyboard.D));
    this.drawKey(0, SPACING, "L", game.input.keyboard.isDown(Phaser.Keyboard.L));

    this.beginFill(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) ? 0x773333 : 0xaaaaaa);
    this.drawRoundedRect(-60 , SPACING * 2, 120, SIZE, 5);
    this.endFill();
};


return KeyboardDisplay;
})();
