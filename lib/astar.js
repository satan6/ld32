var astar = (function() {
	function dist(a, b) {
		return abs(a.x - b.x) + abs(a.y - b.y);
	}

	function astar(pos, dest, width, height, isWalkable) {
		var visited = {};

		function id(pos) {
			return pos.x + pos.y * height;
		}

		function getNeighbors(node) {
			var result = [], p, pos = node.pos;

			if(pos.x > 0) {
				p = new vec2(pos.x - 1, pos.y);
				if(!visited[id(p)] && isWalkable(p))
					open.push(new Node(p, node));
			}

			if(pos.y > 0) {
				p = new vec2(pos.x, pos.y - 1);
				if(!visited[id(p)] && isWalkable(p))
					open.push(new Node(p, node));
			}

			if(pos.x < width) {
				p = new vec2(pos.x + 1, pos.y);
				if(!visited[id(p)] && isWalkable(p))
					open.push(new Node(p, node));
			}

			if(pos.y < height) {
				p = new vec2(pos.x, pos.y + 1);
				if(!visited[id(p)] && isWalkable(p))
					open.push(new Node(p, node));
			}

			return result;
		}

		function Node(pos, parent) {
			this.pos = pos;
			this.parent = parent;
			this.cost = parent ? parent.cost + 1 : 0;
			this.dist = dist(pos, dest);
			visited[id(pos)] = true;
		}

		var open = [new Node(pos)];

		while(open.length) {
			var min = -1;

			for(var i = 0; i < open.length; i++) {
				if(min == -1 || open[i].dist < open[min].dist)
					min = i;
			}

			var node = open[min];
			open.splice(min, 1);

			if(node.pos.eq(dest)) {
				var parent = node;
				var result = [parent.pos];
				while(parent = parent.parent) {
					result.push(parent.pos);
				}
				result.reverse();
				return result;
			}

			open.push.apply(open, getNeighbors(node));
		}
	}

	return astar;
})();