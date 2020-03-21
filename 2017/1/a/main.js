const fs = require('fs');
const path = require('path');

let inputPath = path.resolve(__dirname, 'input.txt');

const rs = fs.createReadStream(inputPath);

var captcha = [];

rs.on('data', (data) => {
	captcha.push(data.toString().split(''));
})


rs.on('close', () => {
	processCaptcha(captcha);
})


function processCaptcha(givenArray) {
	var i = 0;
	var exitCode = false;
	while (!exitCode) {

	}
}