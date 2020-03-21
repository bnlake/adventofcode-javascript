// Node Packages
const fs = require('fs');
const readline = require('readline');
const path = require('path');

// Local Packages / Modules
const Point = require('./Point');
const LineSegment = require('./LineSegment');
const CoordDataMapper = require('./CoordDataMapper');


// Begin
let pathname = path.resolve(__dirname, 'input.txt');
var paths = [];

var rl = readline.createInterface({
	input: fs.createReadStream(pathname)
})

rl.on('line', line => {
	paths.push(line.toString().split(','));
})

rl.on('close', () => {
	processData();
})



/***
 * Begin working the raw data from input
 */
function processData() {
	var coordDataMapper = new CoordDataMapper();
	for (var i = 0; i < paths.length; i++) {
		paths[i] = coordDataMapper.returnVectorPathAsArrayOfPoints(paths[i]);
	}

	// @url https://www.geeksforgeeks.org/check-if-two-given-line-segments-intersect/
	// Let's create arrays of line segments from these points
	let pathsOfLineSegments = [];
	for (var i = 0; i < paths.length; i++) {
		pathsOfLineSegments[i] = [];
		for (var j = 0; j < paths[i].length - 2; j++) {
			let tempSegment = new LineSegment(paths[i][j], paths[i][j + 1]);
			pathsOfLineSegments[i][j] = tempSegment;
		}
	}

	// Let's create an array to store all of the intersection points
	let intersections = [];
	// Now we need to sweep opposing paths that are perpendicular
	intersections = intersections.concat(sweepLineForIntersections(
		pathsOfLineSegments[0].filter((element) => {
			return !element.isVertical();
		}),
		pathsOfLineSegments[1].filter((element) => {
			return element.isVertical();
		})
	))
	// Do it again with the opposite paths
	intersections = intersections.concat(sweepLineForIntersections(
		pathsOfLineSegments[1].filter((element) => {
			return !element.isVertical();
		}),
		pathsOfLineSegments[0].filter((element) => {
			return element.isVertical();
		})
	))

	// Identify the closest intersection based on manhatten distance
	let closestPoint = returnClosestPointFromZero(intersections);
	console.log(Math.abs(closestPoint.x + closestPoint.y));
}





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


/**
 * Given an array of points, returns the point closest to 0,0
 * in manhatten distance
 * @param {Array} pointsAsArray 
 * @returns {Point}
 */
function returnClosestPointFromZero(pointsAsArray) {
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