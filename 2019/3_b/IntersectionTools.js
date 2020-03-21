const Point = require('./Point');

module.exports = class IntersectionTools {
	constructor() {

	}


	static findIntersectionsBetweenOrthogonalPaths(paths) {
		// Let's create an array to store all of the intersection points
		let intersections = [];
		// Loop through every path to check for intersections of perpendicular lines
		let i = 0;
		while (i < paths.length - 1) {
			// Now we need to sweep opposing paths that are perpendicular
			intersections = intersections.concat(sweepLineForIntersections(
				paths[i].filter((element) => {
					return !element.isVertical();
				}),
				paths[i + 1].filter((element) => {
					return element.isVertical();
				})
			))
			// Do it again with the opposite paths
			intersections = intersections.concat(sweepLineForIntersections(
				paths[i + 1].filter((element) => {
					return !element.isVertical();
				}),
				paths[i].filter((element) => {
					return element.isVertical();
				})
			))

			i++;
		}

		// debug: We're forcibly removing the first point (origin) since it's not technically an intersection
		intersections.shift()
		return intersections;


		/**
		 * Given two arrays of perpendicular line segments, identify all segments that intersect each
		 * other. This is accomplished by using the line sweep algorithm method.
		 * @param {array} horizontalLineSegments LineSegment objects of all horizontal lines (unsorted/sorted)
		 * @param {array} verticalLineSegments LineSegment objects of all vertical lines (unsorted/sorted)
		 * @url http://geomalgorithms.com/a09-_intersect-3.html
		 * @returns {Array} All intersection points
		 */
		function sweepLineForIntersections(horizontalLineSegments, verticalLineSegments) {
			var ENDPOINT_LEFT = 0;
			var ENDPOINT_RIGHT = 1;
			var VERTICAL_SEGMENT = 2;
			// Initialize event queue EQ = all segment endpoints and x coordinates of vertical lines;
			// We need to keep track of the event type as well
			var eq = (horizontalLineSegments.map((element) => { return { point: (element.isNegativeDirection()) ? element.p2 : element.p1, eventType: ENDPOINT_LEFT, segment: element } }));
			eq = eq.concat(horizontalLineSegments.map((element) => { return { point: (element.isNegativeDirection()) ? element.p1 : element.p2, eventType: ENDPOINT_RIGHT, segment: element } }));
			eq = eq.concat(verticalLineSegments.map((element) => { return { point: element.p1, eventType: VERTICAL_SEGMENT, segment: element } }));

			// Sort eq by y first
			eq = eq.sort((a, b) => {
				return (a.point.y <= b.point.y) ? -1 : 1;
			})
			// Sort EQ by x; Must sort ascending as the sweep line needs to range ascending
			eq = eq.sort((a, b) => {
				return (a.point.x <= b.point.x) ? -1 : 1;
			})

			// Initialize sweep line SL to be empty;
			var sweepLine = new Set();
			// Initialize output intersection list IL to be empty;
			var intersectionList = [];

			// While (EQ is nonempty) {
			for (var i = 0; i < eq.length; i++) {
				switch (eq[i].eventType) {
					case ENDPOINT_LEFT:
						sweepLine.add(eq[i].segment);
						break;
					case ENDPOINT_RIGHT:
						sweepLine.delete(eq[i].segment);
						break;
					case VERTICAL_SEGMENT:
						for (let segment of sweepLine) {
							if (hasIntersection(segment, eq[i].segment)) {
								intersectionList.push(new Point(eq[i].segment.p1.x, segment.p1.y));
							}
						}
						break;
				}
			}

			/**
			 * Given two perpendicular line segments, identify if the horizontal segment lies within the y
			 * range of the vertical segment.
			 * @param {LineSegment} horizontalSegment 
			 * @param {LineSegment} verticalSegment
			 * @returns {Boolean} 
			 */
			function hasIntersection(horizontalSegment, verticalSegment) {
				if (verticalSegment.isNegativeDirection()) {
					return (verticalSegment.p2.y <= horizontalSegment.p1.y && horizontalSegment.p1.y <= verticalSegment.p1.y);
				} else {
					return (verticalSegment.p1.y <= horizontalSegment.p1.y && horizontalSegment.p1.y <= verticalSegment.p2.y);
				}
			}

			return intersectionList;
		}
	}


	/**
	 * Given an array of points, returns the point closest to 0,0
	 * in manhatten distance
	 * @param {Array} pointsAsArray 
	 * @returns {Point}
	 */
	static returnClosestPointFromZero(pointsAsArray) {
		return pointsAsArray.reduce((previousPoint, currentPoint) => {
			if (getManhattenDistance(currentPoint) < getManhattenDistance(previousPoint)) {
				return currentPoint;
			} else {
				return previousPoint;
			}
		});

		function getManhattenDistance(point) {
			return (Math.abs(point.x) + Math.abs(point.y));
		}
	}


	/**
	 * Given an array of paths and array of intersections,
	 * find the least amount of steps required to reach an intersection
	 * of all paths
	 * @param {array/paths} paths 
	 * @param {array/points} intersections 
	 */
	static findLeastAmountOfStepsToAnIntersection(paths, intersections) {
		let totalStepsToIntersections = [];

		for (let intersection of intersections) {
			let totalStepsToIntersection = []
			for (let path of paths) {
				totalStepsToIntersection.push(IntersectionTools.findStepsToIntersection(path, intersection));
			}
			totalStepsToIntersections.push(totalStepsToIntersection.reduce((prev, curr) => { return prev + curr; }));
		}

		return totalStepsToIntersections;
	}


	/**
	 * Given a path of linesegments and an intersection point,
	 * calculate the distance it took to get to the intersection
	 * @param {array/linesegments} path 
	 * @param {Point} point 
	 */
	static findStepsToIntersection(path, point) {
		const LineSegment = require('./LineSegment');

		var runningTotal = 0;
		let i = 0;
		let exit = false;
		while (!exit) {
			if (this.arePointAndSegmentCoincidient(point, path[i])) {
				runningTotal += (new LineSegment(path[i].p1, point)).distance();
				exit = true;
			} else {
				runningTotal += path[i].distance();
				i++;
			}
		}
		return runningTotal;
	}


	/**
	 * Given a point and line segment, return true if the point
	 * lies on the segment (coincidient)
	 * @param {LineSegment} lineSegment 
	 * @param {Point} point 
	 */
	static arePointAndSegmentCoincidient(point, linesegment) {
		if (linesegment.isVertical()) {
			if (point.x == linesegment.p1.x) {
				// todo: youtube cross product and dot product
				return IntersectionTools.isPointBetweenSegmentEndPoints(point, linesegment);
			} else {
				return false;
			}
		} else {
			if (point.y == linesegment.p1.y) {
				return IntersectionTools.isPointBetweenSegmentEndPoints(point, linesegment);
			} else {
				return false;
			}
		}
	}


	/**
	 * Given a point and line segment, determine if the point
	 * lies between the end points
	 * @param {Point} point 
	 * @param {LineSegment} linesegment 
	 */
	static isPointBetweenSegmentEndPoints(point, linesegment) {
		let isBetweenX = linesegment.minX() <= point.x
			&&
			point.x <= linesegment.maxX();
		let isBetweenY = linesegment.minY() <= point.y
			&&
			point.y <= linesegment.maxY();

		return isBetweenX && isBetweenY;
	}

}