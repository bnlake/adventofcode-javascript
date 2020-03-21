// Node Packages
const fs = require('fs');

// Local Modules
const PasswordChecker = require('./PasswordChecker');

const lowerLimit = 357253;
const upperLimit = 892942;

// We'll use promises to run this as async as possible
// keep an array of promises to check every password
let checkPasswordPromises = [];

console.log('Began the while loop');
let i = lowerLimit;
while (i <= upperLimit) {
	checkPasswordPromises.push(PasswordChecker.isPasswordValid(i));
	i++
}
console.log('Left the while loop');

console.log('Waiting for all promises to finish');
Promise.all(checkPasswordPromises)
	.then((results) => {
		// Now we need to count the amount of true results (password met critierion)
		let countPassedPasswords = 0;
		for (let result of results) {
			if (result) {
				countPassedPasswords++;
			}
		}

		console.log('Total accepted passwords: ', countPassedPasswords);
	})
	.catch((err) => {
		console.error(err);
	})