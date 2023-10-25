"use strict";

/**
 * Cleans and normalizes a string by removing unnecessary spaces.
 * @param {string} str
 * @returns {string}
 */
export function cleanAndNormalizeString(str) {
	if (typeof str === "string") {
		return str.trim().replace(/\s+/g, " ");
	}
	return str;
}
