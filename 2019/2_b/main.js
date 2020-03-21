const fs = require('fs');
const readline = require('readline');
const path = require('path');

let pathname = path.resolve(__dirname, 'input.txt');

var opCodesCSV = '';
const OP_ADD = 1;
const OP_MULT = 2;
const OP_EXIT = 99;

readStream = fs.createReadStream(pathname)

readStream.on('data', (data) => {
	opCodesCSV += data.toString();
})

readStream.on('end', () => {
	var opCodesArray = opCodesCSV.split(',');
	opCodesArray = opCodesArray.map(x => parseInt(x));

	console.log(findNounAndVerb(opCodesArray, 19690720));


	/**
	 * Tries to identify the required noun and verb for address 1 & 2 that
	 * produce a desired result
	 * @param {Array} opCodesArray 
	 */
	function findNounAndVerb(opCodesArray, desiredResult) {
		var noun = 0;
		var verb = 98;
		var max = 99;

		for (noun; noun <= max; noun++) {
			for (verb; verb <= max; verb++) {
				let tempOpCodes = opCodesArray.map(x => x); // Mapping breaks referential assignment
				tempOpCodes[1] = noun;
				tempOpCodes[2] = verb;
				executedOpCodes = executeOpCodes(tempOpCodes);
				if (executedOpCodes[0] == desiredResult) {
					return {
						noun: noun,
						verb: verb
					}
				}
			}
			verb = 0;
		}
		return 'Unable to find solution';
	}

	/**
	 * Executes the Opcodes
	 * @param {Array} opCodesArray Array of execution codes
	 */
	function executeOpCodes(opCodesArray) {
		var newArray = opCodesArray.map(x => x);
		for (var i = 0; i < newArray.length; i += 4) {
			var param1Address = newArray[i + 1];
			var param2Address = newArray[i + 2];
			var outAddress = newArray[i + 3];

			switch (newArray[i]) {
				case OP_ADD:
					newArray[outAddress] = add(newArray[param1Address], newArray[param2Address]);
					break;
				case OP_MULT:
					newArray[outAddress] = mult(newArray[param1Address], newArray[param2Address]);
					break;
				case OP_EXIT:
					return newArray;
				default:
					throw new Error('Unexpected Op Code');
			}
		}
		return newArray;
	}

	/**
	 * Add two numbers together
	 * @param {int} a 
	 * @param {int} b 
	 */
	function add(a, b) {
		return a + b;
	}

	/**
	 * Multiply two numbers together
	 * @param {int} a 
	 * @param {int} b 
	 */
	function mult(a, b) {
		return a * b;
	}
})
