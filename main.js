// Start the game

game.state.add('loading', LoadingScreen, true);
game.state.add('title', TitleScreen);
game.state.add('game', GameState);
game.state.add('credits', CreditsScreen);
game.state.add('gameover', GameOverScreen);

//Level.start(0);

game.volumeControl = new VolumeControl(game, document.getElementById("volume"), document.getElementById("volume-control")); 

document.getElementById("fs").addEventListener("click", function() {
    game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

    if (game.scale.isFullScreen)
    {
        game.scale.stopFullScreen();
    }
    else
    {
        game.scale.startFullScreen(false);
    }
});

function ignore(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    return false;
}

document.addEventListener("keypress", ignore);