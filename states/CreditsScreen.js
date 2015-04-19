var CreditsScreen = (function() {
    function CreditsScreen() {}

    CreditsScreen.prototype.preload = function() {
        game.load.audio('menuloop', 'assets/audio/music/menu.ogg');
    };

    CreditsScreen.prototype.create = function() {
        game.stage.backgroundColor = 0x000000;

        this.credits = new Credits(game);

        this.credits.title("Trees vs Zombies");
        this.credits.credit("Programming", "sathorn");
        this.credits.credit("Graphics", "sathorn");
        this.credits.credit("Writing", "sathorn");
        this.credits.credit("Visual effects", "sathorn");
        this.credits.credit("So basically everything", "sathorn");
        this.credits.credit("Except", "Audio");
        this.credits.category("Music");
        this.credits.by('Ludum Dare 30 - First Track', 'Abstraction Music');
        this.credits.by('Ludum Dare 30 - Second Track', 'Abstraction Music');
        this.credits.by('Ludum Dare 30 - Seventh Track', 'Abstraction Music');
        this.credits.category("Sound Effects");
        this.credits.by('Tree Fall Small Sound', 'Daniel Simion');
        this.credits.by('Kitchen Timer', 'maphill');
        this.credits.category("Made for Ludum Dare");
        this.credits.credit("Number", "32");
        this.credits.credit("Type", "Jam");
        this.credits.credit("Theme", "An Unconventional Weapon");
        this.credits.category("Thanks for playing");

        this.credits.roll(this.finish);

        Music.fadeout('menuloop', 1000);

        this.wasDown = game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || game.input.gamepad.pad1.isDown(Phaser.Gamepad.XBOX360_A);
    };

    CreditsScreen.prototype.update = function() {
        if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || game.input.gamepad.pad1.isDown(Phaser.Gamepad.XBOX360_A)) {
            if(!this.wasDown)
                this.finish();
        } else this.wasDown = false;
    };

    CreditsScreen.prototype.finish = function() {
        game.state.start('title', true);
    };

    return CreditsScreen;
})();