var VolumeControl = (function() {


function VolumeControl(game, icon, slider, storageName) {
    this.game = game;
    this.icon = icon;
    this.slider = slider;
    this.name = storageName || "savedVolume";
    this.setValue(localStorage[this.name] || 100);

    slider.addEventListener("change", function() {
        this.setValue(slider.value);
    }.bind(this));

    slider.value = this.value;
}

VolumeControl.prototype.setValue = function(value) {
    this.value = parseInt(value, 10);
    localStorage[this.name] = value;

    if(this.value == 0)
        this.icon.className = "icon-volume-mute";
    else if(this.value < 25)
        this.icon.className = "icon-volume-low";
    else if(this.value < 75)
        this.icon.className = "icon-volume-medium";
    else
        this.icon.className = "icon-volume-high";

    if(this.game.sound)
        this.game.sound.volume = this.value / 100;
};

VolumeControl.prototype.update = function() {
    this.setValue(this.value);
};


return VolumeControl;

})();