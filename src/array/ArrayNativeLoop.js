"use strict";

/**
 * @template T
 * @class NativeLoopArray
 * @extends {Array<T>}
 */
export default class ArrayNativeLoop extends Array {
	/**
	 * Map native loop
	 * @template U
	 * @param {(item: T, index: number, array: ArrayNativeLoop<T>) => U} callback
	 * @returns {ArrayNativeLoop<U>}
	 */
	map(callback) {
		/** @type {Array<U>} */
		const newArray = [];

		for (let index = 0; index < this.length; index++) {
			newArray[index] = callback(this[index], index, this);
		}

		return new ArrayNativeLoop(...newArray);
	}

	/**
	 * Filter native loop
	 * @param {(item: T, index: number, array: ArrayNativeLoop<T>) => boolean} predicate
	 * @returns {ArrayNativeLoop<T>}
	 */
	filter(predicate) {
		/** @type {Array<T>} */
		const filteredArray = [];

		let filteredArrayIndex = 0;

		for (let index = 0; index < this.length; index++) {
			if (predicate(this[index], index, this)) {
				filteredArray[filteredArrayIndex++] = this[index];
			}
		}

		return new ArrayNativeLoop(...filteredArray);
	}

	/**
	 * ForEach native loop
	 * @param {(item: T, index: number, array: ArrayNativeLoop<T>) => void} callback
	 * @returns {void}
	 */
	forEach(callback) {
		for (let index = 0; index < this.length; index++) {
			callback(this[index], index, this);
		}
	}

	/**
	 * Some native loop
	 * @param {(item: T, index: number, array: ArrayNativeLoop<T>) => void} predicate
	 * @returns {boolean}
	 */
	some(predicate) {
		for (let index = 0; index < this.length; index++) {
			if (predicate(this[index], index, this)) {
				return true;
			}
		}
		return false;
	}

	/**
	 * @template T
	 * @param {T} target - The target object to be updated
	 * @param {T} source - The source object containing new values
	 * @returns {void}
	 */
	static updateObject(target, source) {
		for (let [key, value] of Object.entries(source)) {
			target[key] = value;
		}
	}

	// static get [Symbol.species]() {
	// 	return Array;
	// }
}
