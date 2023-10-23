"use strict";

import { isArrayAndCallback } from "./isTypes";

/**
 * @template T, N
 * @param {Array<T>} array
 * @param {(item: T, index: number, array: Array<T>) => N} callback
 * @returns {Array<N>}
 */
export function mapArrayObject(array, callback) {
	if (!isArrayAndCallback(array, callback)) return;

	return array.map(callback);
}

/**
 * @template T, U
 * @param {Array<T>} array
 * @param {(item: T, index: number, array: Array<T>) => N} callback
 * @returns {Array<U>}
 */
export function mapArrayNativeLoop(array, callback) {
	if (!isArrayAndCallback(array, callback)) return;

	const newArray = [];

	for (let index = 0; index < array.length; index++) {
		newArray[index] = callback(array[index], index, array);
	}
}
