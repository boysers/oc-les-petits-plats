"use strict";

/**
 * @template T
 * @param {Array<T>} array
 * @param {(item: T, index: number, array: Array<T>) => void} callback
 * @returns {void}
 */
export function foreachArrayObject(array, callback) {
	if (!isArrayAndCallback(array, callback)) return;

	array.forEach(callback);
}

/**
 * @template T
 * @param {Array<T>} array
 * @param {(item: T, index: number, array: Array<T>) => void} callback
 * @returns {void}
 */
export function foreachNativeLoop(array, callback) {
	if (!isArrayAndCallback(array, callback)) return;

	for (let index = 0; index < array.length; index++) {
		callback(array[index], index, array);
	}
}

/**
 * @template T
 * @param {Array<T>} array
 * @param {Function} callback
 * @returns {boolean}
 */
function isArrayAndCallback(array, callback) {
	return isArray(array) && isCallback(callback);
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
