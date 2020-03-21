module.exports = class LineSegment {
	constructor(p1, p2) {
		this.p1 = p1;
		this.p2 = p2;
	}

	isVertical() {
		return this.p1.x == this.p2.x;
	}

	isNegativeDirection() {
		if (this.isVertical()) {
			return this.p1.y > this.p2.y;
		} else {

			return this.p1.x > this.p2.x;
		}
	}
}