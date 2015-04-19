var JukeBox = (function() {

var VOLUME = 0.3;

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
	if(this.current == song) return;

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
		
	this.songs[song].fadeIn(fade, true);
	this.current = song;
};

JukeBox.prototype.fadeout = function(song, fade) {
	if(this.current == song) return;

	this.setup(song);
	
	if(!this.current) {
		this.play(song);
		return;
	}

	this.songs[this.current].onFadeComplete.addOnce(function() {
		this.play(song);
	}, this);

	this.songs[this.current].fadeOut(fade);
};

return JukeBox;

})();