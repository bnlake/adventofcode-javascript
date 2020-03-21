module.exports = class VectorDataMapper {
	constructor() {
	}

	/**
	 * Given an array of vectors as strings, convert and return
	 * an array of coordinates.
	 * @param {array} path Array of vectors as string
	 * @returns {array}
	 */
	static returnVectorPathAsArrayOfPoints(path) {
		const Point = require('./Point');
		let workingArray = [];
		// Let's convert each string into a vector object
		for (var i = 0; i < path.length; i++) {
			if (i == 0) {
				workingArray[i] = VectorDataMapper.determineCoordFromPreviousPoint(VectorDataMapper.convertVectorIntoCoords(VectorDataMapper.splitVectorIntoObject(path[i])), new Point(0, 0));
			} else {
				workingArray[i] = VectorDataMapper.determineCoordFromPreviousPoint(VectorDataMapper.convertVectorIntoCoords(VectorDataMapper.splitVectorIntoObject(path[i])), workingArray[i - 1]);
			}
		}

		return workingArray;
	}

	/**
	 * Convert a vector from string to an object
	 * @param {string} vectorAsString 
	 */
	static splitVectorIntoObject(vectorAsString) {
		let regex = (/([A-Za-z])([0-9]+)/).exec(vectorAsString);
		return {
			direction: regex[1],
			distance: regex[2]
		}
	}


	/**
	 * Convert a vector object into a set of coordinates from 0,0
	 * @param {object} vector 
	 */
	static convertVectorIntoCoords(vector) {
		const Point = require('./Point');
		let x = 0;
		let y = 0;

		switch (vector.direction) {
			case 'R':
				x = 1 * vector.distance;
				break;
			case 'L':
				x = -1 * vector.distance;
				break;
			case 'U':
				y = 1 * vector.distance;
				break;
			case 'D':
				y = -1 * vector.distance;
				break;
		}

		return new Point(x, y);
	}


	/**
	 * Determines point on grid based on previous point
	 * @param {int} currentPoint 
	 * @param {int} previousPoint 
	 */
	static determineCoordFromPreviousPoint(currentPoint, previousPoint) {
		const Point = require('./Point');
		return new Point(currentPoint.x + previousPoint.x, currentPoint.y + previousPoint.y);
	}
}