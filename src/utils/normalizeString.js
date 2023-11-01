"use strict";

/**
 * Cleans and normalizes a string by removing unnecessary spaces.
 * @param {string} str
 * @returns {string}
 */
export function normalizeString(str) {
	return str.trim().replace(/\s+/g, " ");
}
