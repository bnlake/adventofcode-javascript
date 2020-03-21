const fs = require('fs');
const readline = require('readline');
const path = require('path');

let pathname = path.resolve(__dirname, 'input.txt');

var sumFuel = 0;


var rl = readline.createInterface({
	input: fs.createReadStream(pathname)
})

rl.on('line', (line) => {
	sumFuel += processFuel(parseInt(line));
})

rl.on('close', () => {
	console.log(sumFuel);
})


const processFuel = (mass) => (Math.floor(mass / 3) - 2);
