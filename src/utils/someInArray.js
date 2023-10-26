"use strict";

import { isArrayAndCallback } from "./isTypes";

/**
 * @template T
 * @param {Array<T>} array
 * @param {(item: T, index: number, array: Array<T>) => void} conditionCallback
 * @returns {boolean}
 */
export function someInArrayObject(array, conditionCallback) {
	if (!isArrayAndCallback(array, conditionCallback)) return;

	return array.some(conditionCallback);
}

/**
 * @template T
 * @param {Array<T>} array
 * @param {(item: T, index: number, array: Array<T>) => void} conditionCallback
 * @returns {boolean}
 */
export function someInArrayNativeLoop(array, conditionCallback) {
	if (!isArrayAndCallback(array, conditionCallback)) return;

	for (let index = 0; index < array.length; index++) {
		if (conditionCallback(array[index], index, array)) {
			return true;
		}
	}
	return false;
}
