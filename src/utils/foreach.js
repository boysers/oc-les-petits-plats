"use strict";

import { isArrayAndCallback } from "./isTypes";

/**
 * @template T
 * @param {Array<T>} array
 * @param {(item: T, index: number, array: Array<T>) => void} callback
 * @returns {void}
 */
export function foreachArrayObject(array, callback) {
	if (!isArrayAndCallback(array, callback)) return;

	array.forEach((item, index, array) => callback(item, index, array));
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
