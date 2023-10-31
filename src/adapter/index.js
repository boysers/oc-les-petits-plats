"use strict";

import { filterArrayObject } from "../utils/filterArray";
import { foreachArrayObject } from "../utils/foreach";
import { instantiateObjectsArrayObject } from "../utils/instantiateObjects";
import { mapArrayObject } from "../utils/mapArray";
import { someInArrayObject } from "../utils/someInArray";
import { updateObjectArrayObject } from "../utils/updateObject";

export { default as ArrayAdapter } from "./ArrayAdapter";

export class Adapter {
	/**
	 * @template O, T
	 * @param {O[]} objects
	 * @param {new (object: O) => T} constructor
	 * @returns {T[]}
	 */
	instantiateObjects(objects, constructor) {
		return instantiateObjectsArrayObject(objects, constructor);
	}

	/**
	 * @template T
	 * @param {T} target - The target object to be updated
	 * @param {T} source - The source object containing new values
	 * @returns {void}
	 */
	updateObject(target, source) {
		updateObjectArrayObject(target, source);
	}

	/**
	 * @template T
	 * @param {Array<T>} array
	 * @param {(item: T, index: number, array: Array<T>) => void} callback
	 * @returns {void}
	 */
	foreach(array, callback) {
		foreachArrayObject(array, callback);
	}

	/**
	 * @template T
	 * @param {Array<T>} array
	 * @param {(item: T, index: number, array: Array<T>) => void} conditionCallback
	 * @returns {boolean}
	 */
	someInArray(array, conditionCallback) {
		return someInArrayObject(array, conditionCallback);
	}

	/**
	 * @template T, U
	 * @param {Array<T>} array
	 * @param {(item: T, index: number, array: Array<T>) => U} callback
	 * @returns {Array<U>}
	 */
	mapArray(array, callback) {
		return mapArrayObject(array, callback);
	}

	/**
	 * @template T
	 * @param {Array<T>} array
	 * @param {(value: T, index: number, array: Array<T>) => boolean} predicate
	 * @returns {Array<T>}
	 */
	filterArray(array, predicate) {
		return filterArrayObject(array, predicate);
	}
}
