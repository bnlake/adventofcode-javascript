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

	// Replace position 1 and 2 per instructions
	opCodesArray[1] = 99;
	opCodesArray[2] = 99;

	let executedOpcodes = executeOpCodes(opCodesArray);

	console.log(executedOpcodes[0]);

	/**
	 * Executes the Opcodes
	 * @param {Array} opCodesArray Array of execution codes
	 */
	function executeOpCodes(opCodesArray) {
		for (var i = 0; i < opCodesArray.length; i += 4) {
			var param1Address = opCodesArray[i + 1];
			var param2Address = opCodesArray[i + 2];
			var outAddress = opCodesArray[i + 3];

			switch (opCodesArray[i]) {
				case OP_ADD:
					opCodesArray[outAddress] = add(opCodesArray[param1Address], opCodesArray[param2Address]);
					break;
				case OP_MULT:
					opCodesArray[outAddress] = mult(opCodesArray[param1Address], opCodesArray[param2Address]);
					break;
				case OP_EXIT:
					return opCodesArray;
				default:
					throw new Error('Unexpected Op Code');
			}
		}
		return opCodesArray;
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
