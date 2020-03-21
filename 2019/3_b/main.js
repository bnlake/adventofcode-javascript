// Node Packages
const fs = require('fs');
const readline = require('readline');
const path = require('path');

// Local Packages / Modules
const Path = require('./Path');
const IntersectionTools = require('./IntersectionTools');
const VectorDataMapper = require('./VectorDataMapper');


// Begin
let pathname = path.resolve(__dirname, 'input.txt');
var vectors = [];

var rl = readline.createInterface({
	input: fs.createReadStream(pathname)
})

rl.on('line', line => {
	vectors.push(line.toString().split(','));
})

rl.on('close', () => {
	processData();
})



/***
 * Begin working the raw data from input
 */
function processData() {
	let paths = [];

	for (var i = 0; i < vectors.length; i++) {
		paths[i] = VectorDataMapper.returnVectorPathAsArrayOfPoints(vectors[i]);
	}

	// Let's create arrays of line segments from these points
	for (var i = 0; i < paths.length; i++) {
		paths[i] = Path.pathFromPoints(paths[i]);
	}

	// Let's create an array to store all of the intersection points
	let intersections = IntersectionTools.findIntersectionsBetweenOrthogonalPaths(paths);

	let distanceToIntersections = IntersectionTools.findLeastAmountOfStepsToAnIntersection(paths, intersections);
	console.log('Least paths distance to an intersection: ', distanceToIntersections.reduce((prev, curr) => { return (curr <= prev) ? curr : prev; }));
}