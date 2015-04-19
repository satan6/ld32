var FSM = (function(){

function FSM(self, states) {
	this.state = null;
	this.states = states;
	this.self = self;
}

FSM.States = function() {
	this.enter = {};
	this.update = {};
	this.leave = {};
};

FSM.prototype.update = function() {
	if(this.states.update[this.state])
		this.states.update[this.state].call(this.self);
};

FSM.prototype.enter = function(state) {
	if(this.states.leave[this.state])
		this.states.leave[this.state].call(this.self);

	this.state = state;

	if(this.states.enter[this.state])
		this.states.enter[this.state].call(this.self);
};

return FSM;

})();