var GamepadDisplay = (function(){


var SIZE = 80;
var BUT_OFFSET = 20;

function GamepadDisplay(game, x, y, pad) {
    Phaser.Graphics.call(this, game, x, y);
    this.pad = pad;
}

GamepadDisplay.prototype = Object.create(Phaser.Graphics.prototype);

GamepadDisplay.prototype.drawButton = function(x, y, text, isDown) {
    this.beginFill(isDown ? 0x773333 : 0xaaaaaa);
    this.drawCircle(x, y, 20);
    var button = new Phaser.Text(game, x, y, text, { font: '11px Arial', fill: isDown ? '#ffffff' : '#000000'});
    button.anchor.x = 0.5;
    button.anchor.y = 0.5;
    this.addChild(button);
    return button;
};

GamepadDisplay.prototype.update = function() {
    this.clear();

    var child;
    while(child = this.children[0]) {
        child.destroy();
    }

    var state = new Phaser.Text(game, 0, 130,
        this.pad.connected ? "Connected" : "Not connected",
        {
            font: '20px Arial',
            fill: this.pad.connected ? '#ffffff' : '#888888'
        }
    );
    state.anchor.x = 0.5;
    this.addChild(state);
    this.tint = this.pad.connected ? 0xffffff : 0x666666;

    // L-Buttons
    var isDown, x, y, caption;

    isDown = this.pad.isDown(Phaser.Gamepad.XBOX360_LEFT_TRIGGER);
    this.beginFill(isDown ? 0x773333 : 0x666666);
    this.drawRoundedRect(-SIZE-28, isDown ? -60 : -65, 48, 40, 10);

    isDown = this.pad.isDown(Phaser.Gamepad.XBOX360_RIGHT_TRIGGER);
    this.beginFill(isDown ? 0x773333 : 0x666666);
    this.drawRoundedRect(SIZE-20, isDown ? -60 : -65, 48, 40, 10);

    isDown = this.pad.isDown(Phaser.Gamepad.XBOX360_LEFT_BUMPER);
    this.beginFill(isDown ? 0x992525 : 0xaaaaaa);
    this.drawRoundedRect(-SIZE-18, isDown ? -55 : -60, 48, 40, 10);

    isDown = this.pad.isDown(Phaser.Gamepad.XBOX360_RIGHT_BUMPER);
    this.beginFill(isDown ? 0x992525 : 0xaaaaaa);
    this.drawRoundedRect(SIZE-30, isDown ? -55 : -60, 48, 40, 10);

    this.endFill();


    // Basic shape

    this.beginFill(0xffffff);
    this.drawCircle(SIZE, 0, 100);
    this.drawCircle(-SIZE, 0, 100);
    this.drawRect(-SIZE, -20, SIZE*2, 70);
    this.endFill();

    this.beginFill(0xffffff);
    this.moveTo(-SIZE-50, 0);
    x = -SIZE-75;
    y = 200;
    this.bezierCurveTo(x, y, x, y, -SIZE+70, 0);
    this.endFill();

    this.beginFill(0xffffff);
    this.moveTo(SIZE+50, 0);
    x = SIZE+75;
    y = 200;
    this.bezierCurveTo(x, y, x, y, SIZE-70, 0);
    this.endFill();


    // Sticks

    this.beginFill(0xffffff);
    this.drawCircle(SIZE-30, 50, 70);
    this.drawCircle(-SIZE+30, 50, 70);

    this.lineStyle(2, 0x777777, 1);
    this.drawCircle(SIZE-30, 50, 50);
    this.drawCircle(-SIZE+30, 50, 50);

    this.lineStyle(2, 0x777777, 1);

    x = this.pad.axis(Phaser.Gamepad.AXIS_2);
    y = this.pad.axis(Phaser.Gamepad.AXIS_3);
    isDown = Math.abs(x) > 0.001 || Math.abs(y) > 0.001;
    this.beginFill(isDown ? 0x773333 : 0xaaaaaa);
    this.drawCircle(SIZE-30 + x * 10, 50 + y * 10, 30);

    x = this.pad.axis(Phaser.Gamepad.AXIS_0);
    y = this.pad.axis(Phaser.Gamepad.AXIS_1);
    isDown = Math.abs(x) > 0.001 || Math.abs(y) > 0.001;
    this.beginFill(isDown ? 0x773333 : 0xaaaaaa);
    this.drawCircle(-SIZE+30 + x * 10, 50 + y * 10, 30);
    this.endFill();


    // Arrowy things

    this.lineWidth = 0;
    this.beginFill(0xaaaaaa);

    this.drawRect(-SIZE-8, -8, 16, 16);

    isDown = this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_UP);
    this.beginFill(isDown ? 0x773333 : 0xaaaaaa);
    this.drawRect(-SIZE-8, -24, 16, 16);

    isDown = this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_RIGHT);
    this.beginFill(isDown ? 0x773333 : 0xaaaaaa);
    this.drawRect(-SIZE+8, -8, 16, 16);

    isDown = this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_DOWN);
    this.beginFill(isDown ? 0x773333 : 0xaaaaaa);
    this.drawRect(-SIZE-8, 8, 16, 16);
    
    isDown = this.pad.isDown(Phaser.Gamepad.XBOX360_DPAD_LEFT);
    this.beginFill(isDown ? 0x773333 : 0xaaaaaa);
    this.drawRect(-SIZE-8 - 16, -8, 16, 16);

    this.endFill();


    // Buttons

    this.drawButton(SIZE + BUT_OFFSET, 0, 'B', this.pad.isDown(Phaser.Gamepad.XBOX360_B));
    this.drawButton(SIZE - BUT_OFFSET, 0, 'X', this.pad.isDown(Phaser.Gamepad.XBOX360_X));
    this.drawButton(SIZE, BUT_OFFSET, 'A', this.pad.isDown(Phaser.Gamepad.XBOX360_A));
    this.drawButton(SIZE, -BUT_OFFSET, 'Y', this.pad.isDown(Phaser.Gamepad.XBOX360_Y));
    this.endFill();


    // in the middle

    isDown = this.pad.isDown(Phaser.Gamepad.XBOX360_START);
    this.beginFill(isDown ? 0x773333 : 0xaaaaaa);
    this.drawRoundedRect(8, 5, 20, 7, 3);
    this.endFill();
    caption = new Phaser.Text(game, 19, 12, 'Start', { font: '10px Arial', fill: '#000000'});
    caption.anchor.x = 0.5;
    this.addChild(caption);

    isDown = this.pad.isDown(Phaser.Gamepad.XBOX360_BACK);
    this.beginFill(isDown ? 0x773333 : 0xaaaaaa);
    this.drawRoundedRect(-28, 5, 20, 7, 3);
    this.endFill();
    caption = new Phaser.Text(game, -19, 12, 'Select', { font: '10px Arial', fill: '#000000'});
    caption.anchor.x = 0.5;
    this.addChild(caption);
};


return GamepadDisplay;
})();
