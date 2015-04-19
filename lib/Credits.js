var Credits = (function() {
    function Credits(game) {
        this.group = game.add.group();
        this.p = 0;
    }

    Credits.prototype.title = function(name) {
         var title = game.add.text(game.width/2, this.p, name, {
            font: "40px Roboto",
            fill: "#fff"
        }, this.group);
        title.anchor.x = 0.5;
        title.anchor.y = 0.5;

        this.p += 100;
    };

    Credits.prototype.category = function(name) {
        this.p += 60;

        var title = game.add.text(game.width/2, this.p, name, {
            font: "28px Roboto",
            fill: "#fff"
        }, this.group);
        title.anchor.x = 0.5;
        title.anchor.y = 0.5;

        this.p += 50;
    };

    Credits.prototype.credit = function(what, who) {
        var thing = game.add.text(game.width/2 - 10, this.p, what, {
            font: "16px Roboto",
            fill: "#999"
        }, this.group);
        thing.anchor.x = 1;
        thing.anchor.y = 0.5;

        var guy = game.add.text(game.width/2 + 10, this.p, who, {
            font: "18px Roboto",
            fill: "#fff"
        }, this.group);
        guy.anchor.x = 0;
        guy.anchor.y = 0.5;

        this.p += 30;
    };

    Credits.prototype.by = function(what, who) {
        var name = game.add.text(game.width/2 - 20, this.p, what, {
            font: "18px Roboto",
            fill: "#fff"
        }, this.group);
        name.anchor.x = 1;
        name.anchor.y = 0.5;

        var by = game.add.text(game.width/2, this.p, "by", {
            font: "16px Roboto",
            fill: "#999"
        }, this.group);
        by.anchor.x = 0.5;
        by.anchor.y = 0.5;

        var guy = game.add.text(game.width/2 + 20, this.p, who, {
            font: "18px Roboto",
            fill: "#fff"
        }, this.group);
        guy.anchor.x = 0;
        guy.anchor.y = 0.5;

        this.p += 30;
    };

    Credits.prototype.roll = function(onFinish) {
        this.group.position.y = game.height + 30;

        var scroll = game.add.tween(this.group.position);
        scroll.to({y: -(this.p + 50)}, this.p * 60).start();
        scroll.onComplete.add(onFinish);

        this.infoText = game.add.text(game.width - 10, game.height - 10, 'SPACE to skip', {
            font: "12px Arial",
            fill: "#aaaaaa"
        });
        this.infoText.anchor.x = 1;
        this.infoText.anchor.y = 1;
        this.infoText.alpha = 0;

        game.add.tween(this.infoText).to({alpha: 1}, 500, undefined, true, 1000);
    };

    return Credits;

})();