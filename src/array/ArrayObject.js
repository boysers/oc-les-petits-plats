"use strict";

/**
 * @template T
 * @class ArrayObjet
 * @extends {Array<T>}
 */
export default class ArrayObjet extends Array {
	/**
	 * @template T
	 * @param {T} target - The target object to be updated
	 * @param {T} source - The source object containing new values
	 * @returns {void}
	 */
	static updateObject(target, source) {
		Object.entries(source).forEach(([key, value]) => {
			target[key] = value;
		});
	}
}
