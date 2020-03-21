const fs = require('fs');
const readline = require('readline');
const path = require('path');

let pathname = path.resolve(__dirname, 'input.txt');

var sumFuel = 0;


var rl = readline.createInterface({
	input: fs.createReadStream(pathname)
})

rl.on('line', (line) => {
	sumFuel += processModule(parseInt(line), 0);
})

rl.on('close', () => {
	console.log(sumFuel);
})


function processModule(module) {
	var x = calculateFuel(module);

	if (x <= 0) {
		return 0;
	} else {
		return x + processModule(x);
	}
}

const calculateFuel = (mass) => {
	return (Math.floor(mass / 3) - 2);
}
