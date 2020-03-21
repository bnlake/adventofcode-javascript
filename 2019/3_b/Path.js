const LineSegment = require('./LineSegment');
const Point = require('./Point');

module.exports = class Path {

	/**
	 * Given an array of ordered points, return line segments of the ordered
	 * path
	 * @param {array} points 
	 */
	static pathFromPoints(points) {
		let returnArray = [];

		let i = 0;
		while (i < points.length) {
			if (i == 0) {
				let tempSegment = new LineSegment(new Point(0, 0), points[i]);
				returnArray.push(tempSegment);
			} else {
				let tempSegment = new LineSegment(points[i - 1], points[i]);
				returnArray.push(tempSegment);
			}

			i++;
		}

		return returnArray;
	}
}