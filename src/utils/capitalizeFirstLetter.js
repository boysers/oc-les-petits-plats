/**
 * Capitalize the first letter of the sentence
 * @param {string} str
 * @returns {boolean}
 */
export function capitalizeFirstLetter(str) {
	return str ? str[0].toUpperCase() + str.slice(1).toLowerCase() : str;
}
