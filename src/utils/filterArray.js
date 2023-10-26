"use strict";

import { isArrayAndCallback } from "./isTypes";

/**
 * @template T
 * @param {Array<T>} array
 * @param {(value: T, index: number, array: Array<T>) => boolean} predicate
 * @returns {Array<T>}
 */
export function filterArrayObject(array, predicate) {
	if (!isArrayAndCallback(array, predicate)) return;

	return array.filter((value, index, array) =>
		predicate(value, index, array)
	);
}

/**
 * @template T
 * @param {Array<T>} array
 * @param {(value: T, index: number, array: Array<T>) => boolean} predicate
 * @returns {Array<T>}
 */
export function filterArrayNativeLoop(array, predicate) {
	if (!isArrayAndCallback(array, predicate)) return;

	/** @type {Array<T>} */
	const filteredArray = [];

	for (let index = 0; index < array.length; index++) {
		if (predicate(array[index], index, array)) {
			filteredArray.push(array[index]);
		}
	}

	return filteredArray;
}
