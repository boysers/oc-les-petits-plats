"use strict";

/**
 * @template T
 * @param {T} target
 * @param {T} source
 * @returns {boolean}
 */
export function isTargetAndSourceObject(target, source) {
	return isObject(target) && isObject(source);
}

/**
 * @template T
 * @param {Array<T>} array
 * @param {Function} callback
 * @returns {boolean}
 */
export function isArrayAndCallback(array, callback) {
	return isArray(array) && isCallback(callback);
}

/**
 * @template T
 * @param {T} object
 * @returns {boolean}
 */
function isObject(object) {
	return typeof object === "object";
}

/**
 * @param {Function} callback
 * @returns {boolean}
 */
function isCallback(callback) {
	return callback instanceof Function;
}

/**
 * @template T
 * @param {Array<T>} array
 * @returns {boolean}
 */
function isArray(array) {
	return Array.isArray(array);
}
