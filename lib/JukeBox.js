var JukeBox = (function() {

var VOLUME = 0.4;

function JukeBox(game) {
	this.game = game;
	this.current = null;
	this.songs = {};
}

JukeBox.prototype.setup = function(song) {
	if(this.songs[song]) return;
	this.songs[song] = game.add.audio(song);
	this.songs[song].volume = VOLUME;
	this.songs[song].loop = true;
};

JukeBox.prototype.play = function(song) {
	//if(this.current == song) return;

	this.setup(song);
	
	if(this.current)
		this.songs[this.current].stop();

	this.songs[song].volume = VOLUME;

	this.songs[song].play();
	this.current = song;
};

JukeBox.prototype.crossfade = function(song, fade) {
	if(this.current == song) return;

	this.setup(song);
	
	if(this.current) {
		this.songs[this.current].fadeOut(fade);
	}
	
	this.songs[song].volume = VOLUME;
	this.songs[song].fadeIn(fade, true);
	this.current = song;
};

JukeBox.prototype.fadeout = function(song, fade) {
	if(this.current == song && !this.isFading) return;

	this.setup(song);
	
	if(!this.current) {
		this.play(song);
		return;
	}

	this.afterFade = song;

	if(!this.isFading) {
		this.isFading = true;
		this.songs[this.current].onFadeComplete.addOnce(function() {
			this.isFading = false;
			this.play(this.afterFade);
		}, this);
		this.songs[this.current].fadeOut(fade);
	} else { // we fucked up
		this.play(song);
		this.isFading = false;
	}
};

return JukeBox;

})();