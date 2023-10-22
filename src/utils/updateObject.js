"use strict";

/**
 * @template T
 * @param {T} target
 * @param {T} source
 * @returns {void}
 */
export function updateObjectArrayObject(target, source) {
	if (!isTargetAndSourceObject(target, source)) return;

	for (let [key, value] of Object.entries(source)) {
		target[key] = value;
	}
}

/**
 * @template T
 * @param {T} target
 * @param {T} source
 * @returns {void}
 */
export function updateObjectNativeLoop(target, source) {
	if (!isTargetAndSourceObject(target, source)) return;

	Object.entries(source).forEach(([key, value]) => {
		target[key] = value;
	});
}

/**
 * @template T
 * @param {T} target
 * @param {T} source
 * @returns {boolean}
 */
function isTargetAndSourceObject(target, source) {
	return isObject(target) && isObject(source);
}

/**
 * @template T
 * @param {T} object
 * @returns {boolean}
 */
function isObject(object) {
	return typeof object === "object";
}
