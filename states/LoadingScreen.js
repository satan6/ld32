var LoadingScreen = (function() {

    function LoadingScreen() {}

    LoadingScreen.prototype.preload = function() {};

    LoadingScreen.prototype.create = function() {
        this.progress = game.add.text(game.width/2, game.height/2, '0%', { font: '20px Arial', fill: '#ffffff' });
        this.progress.anchor.set(0.5, 0.5);
        this.progress.visible = false;

        game.state.states.title.preload();
        game.state.states.game.preload();
        game.state.states.credits.preload();
        game.load.start();

        // Don't flash the indicator on very fast loads
        var timer = game.time.create(true);

        timer.add(600, function() {
            if(game.load.progress < 66)
                this.progress.visible = true;
        }, this);

        timer.start();

        game.volumeControl.update();

        Music = new JukeBox(game);
    };

    var isLoaded = false;
    LoadingScreen.prototype.update = function() {
        this.progress.text = ( game.load.hasLoaded ? "100" : game.load.progress.toString() ) + "%";

        if(game.load.hasLoaded && WebFontConfig.isLoaded)
            game.state.start('title', true);
    };

    return LoadingScreen;

})();