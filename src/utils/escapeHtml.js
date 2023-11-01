"use strict";

// https://stackoverflow.com/questions/6234773/can-i-escape-html-special-chars-in-javascript
const htmlEscapeMap = new Map([
	["&", "&amp;"],
	["<", "&lt;"],
	[">", "&gt;"],
	['"', "&quot;"],
	["'", "&#039;"],
]);

/**
 * @param {string} unsafe
 * @returns {string}
 */
export function escapeHtml(unsafe) {
	return unsafe.replace(/[&<>"']/g, (m) => htmlEscapeMap.get(m));
}
