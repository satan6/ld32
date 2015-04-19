var TitleScreen = (function() {

    function Menu(container, width, height, title, onback) {
        this.group = game.add.group(container);
        this.width = width;
        this.height = height;
        this.p = 0;
        this.sound_select = game.add.sound("ui_select");
        this.sound_hover = game.add.sound("ui_hover");

        if(title) {
            var title = game.add.text(this.width, this.p, title, { font: '700 80px Roboto', fill: '#ffffff' }, this.group);
            title.anchor.x = 1;
        }

        if(onback) {
            var entry = game.add.text(10, this.height - 10, "BACK", { font: '700 30px Roboto', fill: '#aaaaaa' }, this.group);
            //entry.anchor.x = 1;
            entry.anchor.y = 1;

            entry.events.onInputOver.add(function() {
                entry.fill = "#ffffff";
                this.sound_hover.play();
            }, this);

            entry.events.onInputDown.add(function() {
                this.sound_select.play();
                onback();
            }, this);

            entry.events.onInputOut.add(function() {
                entry.fill = "#aaaaaa";
            }, this);

            entry.inputEnabled = true;
            entry.input.useHandCursor = true;
        }

        this.p += 150;
    }

    Menu.prototype.add = function(element) {
        element.addTo(this);
    };

    Menu.prototype.hide = function() {
        this.group.visible = false;
    };

    Menu.prototype.show = function() {
        this.group.visible = true;
    };

    Menu.Button = function(name, onclick) {
        this.name = name;
        this.onclick = onclick;
    };

    Menu.Button.prototype.addTo = function(menu) {
        var entry = game.add.text(menu.width, menu.p, this.name, { font: '700 50px Roboto', fill: '#aaaaaa' }, menu.group);
        menu.p += 70;
        entry.anchor.x = 1;

        entry.events.onInputOver.add(function() {
            entry.fill = "#ffffff";
            menu.sound_hover.play();
        }, this);

        entry.events.onInputDown.add(function() {
            menu.sound_select.play();
            this.onclick();
        }, this);

        entry.events.onInputOut.add(function() {
            entry.fill = "#aaaaaa";
        }, this);

        entry.inputEnabled = true;
        entry.input.useHandCursor = true;
    };

    function TitleScreen() {}

    var music;

    TitleScreen.prototype.preload = function() {
        game.load.audio('ui_select', 'assets/audio/ui_select.wav');
        game.load.audio('ui_hover', 'assets/audio/ui_hover.wav');
        game.load.audio('menuloop', 'assets/audio/music/menu.ogg');
        game.load.image('titlescreen', 'assets/sprites/titlescreen.png');
    };

    TitleScreen.prototype.create = function() {
        //game.input.gamepad.start();
        
        if(!(game.renderer instanceof PIXI.WebGLRenderer)) {
            alert("Your game is running without WebGL. It will not look pretty.");
        }

        if(!game.sound.usingWebAudio) {
            alert("Your game is running without WebAudio. It will not sound good.");
        }

        game.stage.backgroundColor = 0x000000;

        game.add.sprite(0, 0, "titlescreen");

        var container = game.add.group();

        container.position.set(60, 130);

        var mainMenu = new Menu(container, 400, 500);

        mainMenu.add(new Menu.Button("PLAY", function() {
            game.state.start('game', true);
        }));
        mainMenu.add(new Menu.Button("CREDITS", function() {
            game.state.start("credits", true);
        }));

        var darkness = game.add.bitmapData(game.width, game.height);
        darkness.context.fillStyle = "black";
        darkness.context.fillRect(0, 0, game.width, game.height);

        this.black = game.add.sprite(0, 0, darkness);

        var tweenTop = game.add.tween(this.black);
        tweenTop.onComplete.add(function() {
            
        }, this);
        tweenTop.to({
            alpha: 0
        }, 1300, Phaser.Easing.Quadratic.Out, true);

        Music.play('menuloop');
    };

    TitleScreen.prototype.update = function() {};

    return TitleScreen;
})();