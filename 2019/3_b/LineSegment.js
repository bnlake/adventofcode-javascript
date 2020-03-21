module.exports = class LineSegment {
	constructor(p1, p2) {
		this.p1 = p1;
		this.p2 = p2;
	}

	distance() {
		return Math.sqrt(Math.pow(this.p2.x - this.p1.x, 2) + Math.pow(this.p2.y - this.p1.y, 2));
	}

	isVertical() {
		return this.p1.x == this.p2.x;
	}

	minX() {
		return Math.min(this.p1.x, this.p2.x);
	}
	maxX() {
		return Math.max(this.p1.x, this.p2.x);
	}

	minY() {
		return Math.min(this.p1.y, this.p2.y);
	}
	maxY() {
		return Math.max(this.p1.y, this.p2.y);
	}

	isNegativeDirection() {
		if (this.isVertical()) {
			return this.p1.y > this.p2.y;
		} else {

			return this.p1.x > this.p2.x;
		}
	}
}