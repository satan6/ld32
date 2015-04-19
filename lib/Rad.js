var Rad = (function() {
	var Rad = {
		/* Normalize v to 0 -> 2PI */
		norm: function(v) {
			if(v < 0)
				return this.norm(v + Math.PI * 2);
			if(v > Math.PI * 2)
				return this.norm(v - Math.PI * 2);
			return v;
		},
		/* Linear interpolation between a and b */
		lerp: function(a, b, v) {
			var high = Math.max(a, b);
			var low = Math.min(a, b);
			var dist = high - low;
			var sign = false;
			if(dist > Math.PI) {
				dist = Math.PI * 2 - dist;
				sign = !sign;
			}
			if(a > b) sign = !sign;
			if(sign)
				dist = dist * -1;
			return a + dist * v;
		},
		/* Difference of two angles */
		diff: function(a, b) {
			a = this.norm(a);
			b = this.norm(b);
			return Math.abs(a - b);
		},
		/* Angle between two vectors */
		between: function(a, b) {
			var diff = b.minus(a);
			var angle = Math.atan2(diff.y, diff.x);
			return this.norm(angle);
		},
		/* Is going clockwise shorter than ccw from current to dest angle */
		shorterCW: function(current, dest) {
			current = this.norm(current);
			dest = this.norm(dest);
			var high = Math.max(current, dest);
			var low = Math.min(current, dest);
			var result = false;
			if(high - low < Math.PI) {
				result = true;
			}
			if(current > dest) result = !result;
			return result;
		}
	};

	return Rad;
})();