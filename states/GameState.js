var isWin, needsTutorial;

var player, timer;

var world, corpses, trees, zombies;

var onTreeChopped, onTimerRing;

function GameState() {}

GameState.prototype.preload = function() {
    game.load.image('background', 'assets/sprites/background.png');
    game.load.image('stem', 'assets/sprites/stem.png');
    game.load.image('stump', 'assets/sprites/stump.png');
    game.load.image('stemEnd', 'assets/sprites/stemEnd.png');
    game.load.image('axe', 'assets/sprites/axe.png');
    game.load.image('playerPortrait', 'assets/sprites/playerPortrait.png');
    game.load.image('playerPortrait_sad', 'assets/sprites/playerPortrait_sad.png');
    game.load.image('zombiePortrait', 'assets/sprites/zombiePortrait.png');
    game.load.image('splinter', 'assets/sprites/splinter.png');
    game.load.image('blood', 'assets/sprites/blood.png');
    game.load.spritesheet('player', 'assets/sprites/player.png', 32, 32);
    game.load.spritesheet('zombie', 'assets/sprites/zombie.png', 32, 32);
    game.load.spritesheet('zombie_dead', 'assets/sprites/zombie_dead.png');
    game.load.spritesheet('timer', 'assets/sprites/timer.png', 32, 32);
    game.load.spritesheet('branches', 'assets/sprites/branches.png', 128, 256);
    game.load.spritesheet('fall_indicator', 'assets/sprites/indicator.png', 640, 64);

    game.load.audio('happyMusic', 'assets/audio/music/happy.ogg');
    game.load.audio('actionMusic', 'assets/audio/music/action.ogg');

    game.load.audio('chop', 'assets/audio/chop.wav');
    game.load.audio('treefall', 'assets/audio/treefall.ogg');
    game.load.audio('ring_loop', 'assets/audio/ring_loop.wav');
    game.load.audio('tick_loop', 'assets/audio/tick_loop.wav');
    game.load.audio('axe_swing', 'assets/audio/swing_axe.wav');
    game.load.audio('pickup', 'assets/audio/pickup.wav');
    game.load.audio('zombie_confused', 'assets/audio/zombie_confused.wav');
    game.load.audio('zombie_attack', 'assets/audio/zombie_attack.wav');
    game.load.audio('zombie_die', 'assets/audio/zombie_die.wav');

    /*game.load.script('blurx', 'filters/BlurX.js');
    game.load.script('game', 'filters/Game.js');
    game.load.text("gameshader", "filters/shaders/Game.fs");*/
};

GameState.prototype.create = function() {
    var screenShake = game.plugins.add(Phaser.Plugin.ScreenShake);
    game.plugins.screenShake = screenShake;

    game.plugins.audio = game.plugins.add(Phaser.Plugin.Audio);
    
    game.stage.backgroundColor = 0x000000;

    game.world.setBounds(0, 0, 2560, 1440);

    this.world = world = game.add.group();

    //filter = game.add.filter("Game");
    //filterPreBlur = game.add.filter("BlurX");
    //this.world.filters = [filterPreBlur, filter];

    game.physics.startSystem(Phaser.Physics.P2JS);


    // Background

    background = game.add.sprite(0, 0, 'background', 0, world);
    corpses = game.add.group(world);
    zombies = game.add.group();
    trees = game.add.group();

    player = new Player(1280, 720);
    timer = new Timer();

    game.camera.follow(player.sprite, Phaser.Camera.FOLLOW_TOPDOWN_TIGHT);

    for(var i = 0; i < 30; i++) {
        var needNew = true;
        while(needNew) {
            var pos = new vec2(Math.random() * game.world.width, Math.random() * game.world.height);
            
            needNew = false;
            trees.forEach(function(sprite) {
                if(pos.dist(sprite.position) < 150)
                    needNew = true;
            });

            if(pos.dist(player.sprite.position) < 100)
                needNew = true;
        }

        new Tree(pos.x, pos.y);
    }

    this.intro1 = new Story([
        new Story.Speech("playerPortrait", "Jack",  "What a beautiful day to chop some trees!"),
        new Story.Text("Move around with WASD,\nthen chop 'em with your mouse!"),
    ], true);

    this.intro2 = new Story([
        new Story.Speech("playerPortrait", "Jack",  "I sure love choppin' ma trees,\ni could do it all day long."),
        new Story.Speech("playerPortrait", "Jack",  "But i need to mind the time!\nI should use my timer."),
        new Story.Text("Throw the timer at your cursor with SPACE.\nThen chop trees till the time is out!"),
    ], true);

    this.intro3 = new Story([
        new Story.Speech("playerPortrait", "Jack",  "Oh no, zombies!\nThey must be drawn to the sound!"),
        new Story.Speech("zombiePortrait", "Zombie",  "Hnnnnraagagafgädgösdfgjλasfκgdöas!", true),
        new Story.Speech("playerPortrait", "Jack",  "Damn zombies, get out of my forest!"),
        new Story.Fn(function(next) {
            timer.timer.resume();
            next();
        })
    ], true);

    this.story = null;

    isWin = false;

    //this.story.start();
    
    if(needsTutorial) {
        this.story = this.intro1;
        this.story.start();

        onTreeChopped = function() {
            this.story = this.intro2;
            this.story.start();
            timer.enable();
            onTreeChopped = null;

            onTimerRing = function() {
                this.spawnZombies();
                this.story = this.intro3;
                this.story.start();
                Music.fadeout("actionMusic", 1000);
                timer.timer.pause();

                onTimerRing = null;
            }.bind(this);
        }.bind(this);

        Music.play("happyMusic");
    } else {
        this.spawnZombies();
        timer.enable();
        Music.fadeout("actionMusic", 1000);
    }


    game.time.advancedTiming = true;
    fpsText = game.add.text(
        20, 20, '', { font: '16px Arial', fill: '#ffffff' }
    );
    fpsText.fixedToCamera = true;

    this.setupPause();
};

GameState.prototype.spawnZombies = function() {
    for(var i = 0; i < 70; i++) {
        var needNew = true;
        while(needNew) {
            var pos = new vec2(Math.random() * game.world.width, Math.random() * game.world.height);
            
            needNew = false;
            if(pos.dist(player.sprite.position) < 300)
                needNew = true;
        }

        new Zombie(pos.x, pos.y);
    }
};

GameState.prototype.update = function() {
    if(game.time.fps !== 0) {
        fpsText.setText(game.time.fps + ' FPS');
    }

    trees.forEach(function(tree) { // let trees fall during story
        tree.ent.update();
    });

    if(this.story && this.story.isActive) {
        zombies.forEach(function(zombie) {
            zombie.body.setZeroVelocity();
            zombie.body.setZeroRotation();
        });

        player.sprite.body.setZeroVelocity();
        player.sprite.body.setZeroRotation();
        return this.story.update();
    }

    if(isWin) { 
        this.story = new Story([
            new Story.Speech("playerPortrait", "Jack",  "This is what you get, zombies!\nRekt!"),
            new Story.Speech("playerPortrait", "Jack",  "Mhm...\nBut i'm still all by myself in the zombie apocalypse."),
            new Story.Speech("playerPortrait_sad", "Jack",  "Oh no, i'm so sad and alone...\nI just want a companion!"),
            new Story.Fn(function(next) {
                game.state.start("credits", true);
                next();
            })
        ], true);

        this.story.start();
    }


    player.update();
    timer.update();

    zombies.forEach(function(zombie) {
        zombie.ent.update();
    });

    trees.sort("fallTime");

    /*game.physics.arcade.collide(player.sprite, zombies, function(player, zombie) {
        game.state.start("title", true);
    });*/

    if(game.input.keyboard.isDown(Phaser.Keyboard.ESC) || game.input.gamepad.pad1.isDown(Phaser.Gamepad.XBOX360_START))
        this.pauseGame();
};

GameState.prototype.shutdown = function() {
    timer.ring.stop();
    timer.tick.stop();
};

GameState.prototype.setupPause = function() {
    var bm = game.add.bitmapData(game.width, game.height);
    bm.context.fillStyle = "black";
    bm.context.fillRect(0, 0, game.width, game.height);

    this.pauseOverlay = game.make.sprite(0, 0, bm);
    this.pauseOverlay.fixedToCamera = true;
    this.pauseOverlay.alpha = 0.8;
    var pauseText = game.make.text(
        640, game.height/2, 'Paused', { font: '30px Arial', fill: '#ffffff' }
    );
    pauseText.anchor.set(0.5, 0.5);
    var resumeText = game.make.text(
        640, game.height/2 + 100, 'Press SPACE to continue.', { font: '14px Arial', fill: '#ffffff' }
    );
    resumeText.anchor.set(0.5, 0);
    this.pauseOverlay.addChild(pauseText);
    this.pauseOverlay.addChild(resumeText);
    //this.pauseOverlay.addChild(game.make.sprite(700, 200, "help"));
};

GameState.prototype.pauseGame = function() {
    if(game.paused) return;
    game.add.existing(this.pauseOverlay);
    game.paused = true;
    this.pauseOverlay.wasDown = false;
};

GameState.prototype.pauseUpdate = function() {
    if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || game.input.gamepad.pad1.isDown(Phaser.Gamepad.XBOX360_A)) {
        if(!this.pauseOverlay.wasDown) return;
        game.world.remove(this.pauseOverlay);
        game.paused = false;
    } else
        this.pauseOverlay.wasDown = true;
};