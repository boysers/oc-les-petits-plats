"use strict";

import { foreachArrayObject } from "../utils/foreach";
import { instantiateObjectsArrayObject } from "../utils/instantiateObjects";
import { updateObjectArrayObject } from "../utils/updateObject";

export class Adapter {
	/**
	 * @template O, T
	 * @param {O[]} objects
	 * @param {new (object: O) => T} constructor
	 * @returns {T[]}
	 */
	createInstantiateObjects(objects, constructor) {
		return instantiateObjectsArrayObject(objects, constructor);
	}

	/**
	 * @template T
	 * @param {T} target
	 * @param {T} source
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
}
