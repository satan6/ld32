var GameOverScreen = (function() {

    function GameOverScreen() {}

    GameOverScreen.prototype.preload = function() {
        game.load.audio('menuloop', 'assets/audio/music/menu.ogg');
    };

    GameOverScreen.prototype.create = function() {
        game.stage.backgroundColor = 0x000000;

        this.titleText = game.add.text(640, 360, 'GAME OVER', {
            font: "700 120px Roboto",
            fill: "#a11d21"
        });
        this.titleText.anchor.x = 0.5;
        this.titleText.anchor.y = 1;


        this.text0 = game.add.text(640, 400, "The zombies got ya.", {
            font: "30px Roboto",
            fill: "#ffffff"
        });
        this.text0.anchor.x = 0.5;

        this.text1 = game.add.text(640, 600, 'Press SPACE to try again.', {
            font: "18px Roboto",
            fill: "#aaaaaa"
        });
        this.text1.anchor.x = 0.5;

        Music.fadeout('menuloop', 1000);

        needsTutorial = false;
    };

    GameOverScreen.prototype.update = function() {

        if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || game.input.gamepad.pad1.isDown(Phaser.Gamepad.XBOX360_A))
            game.state.start("game", true);
    };

    return GameOverScreen;
})();