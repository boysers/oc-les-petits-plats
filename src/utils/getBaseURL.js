"use strict";

/** @returns {string} */
export function getBaseURL() {
	const origin = document.location.origin;
	const base = import.meta.env.BASE_URL;
	return origin + base;
}
