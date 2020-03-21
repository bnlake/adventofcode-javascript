module.exports = class PasswordChecker {
	constructor() {

	}

	static isPasswordValid(password) {
		return new Promise((resolve, reject) => {
			// Since every check returns a promise, we'll keep an array of those criteria checks
			let criteriaPromises = [];
			// Begin pushing the criteria checks to the promise array
			criteriaPromises.push(PasswordChecker.assertPasswordDigits(password, 6));
			criteriaPromises.push(PasswordChecker.assertPasswordDigitsAreAscending(password));
			criteriaPromises.push(PasswordChecker.assertAtLeastOneDigitHasAdjacentMatch(password));

			// Make sure all of the promises have reached a result
			Promise.all(criteriaPromises)
				.then((result) => {
					// We will be receiving the array of promises so we need to reduce them to one value
					// They should all be true, or return false if any of them are false.
					resolve(result.reduce((prev, curr) => {
						return (prev == false || curr == false) ? false : true;
					}));
				})
				.catch((error) => {
					reject(error);
				})
		})
	}


	/**
	 * Given a password and specified amount of digits,
	 * assert that the password holds that many digits
	 * @param {int} password 
	 * @param {int} digits 
	 * @returns {Promise}
	 */
	static assertPasswordDigits(password, digits) {
		return new Promise((resolve, reject) => {
			try {
				resolve(password.toString().split('').length == digits);
			} catch (error) {
				reject(error);
			}
		});
	}


	/**
	 * Given a password, assert that the password is ascending left to right
	 * @param {int} password 
	 * @returns {Promise}
	 */
	static assertPasswordDigitsAreAscending(password) {
		return new Promise((resolve, reject) => {
			try {
				let passwordAsString = password.toString().split('');

				// We'll use reduce to compare each item and resolve(false) to get out of
				// the loop when the criteria is no longer met
				passwordAsString.reduce((prev, curr) => {
					if (parseInt(curr) < parseInt(prev)) {
						resolve(false);
					} else {
						return curr;
					}
				})
				// The loop finished without rejection, therefore the criteria was
				// met.
				resolve(true);
			} catch (error) {
				reject(error);
			}
		});
	}


	/**
	 * Given a password, assert that at least one digit
	 * has the identical digit adjacent to it
	 * @param {int} password 
	 */
	static assertAtLeastOneDigitHasAdjacentMatch(password) {
		return new Promise((resolve, reject) => {
			try {
				let passwordAsString = password.toString().split('');

				let i = 0;
				while (i < passwordAsString.length - 1) {
					if (passwordAsString[i] == passwordAsString[i + 1]) {
						resolve(true);
					}
					i++;
				}

				resolve(false);
			} catch (error) {
				reject(error);
			}
		});
	}
}