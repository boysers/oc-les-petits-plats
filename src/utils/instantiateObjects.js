"use strict";

/**
 * @template O, T
 * @param {O[]} objects
 * @param {new (object: O) => T} constructor
 * @returns {T[]}
 */
export function instantiateObjectsArrayObject(objects, constructor) {
	return objects.map((object) => new constructor(object));
}

/**
 * @template O, T
 * @param {O[]} objects
 * @param {new (object: O) => T} constructor
 * @returns {T}
 */
export function instantiateObjectsNativeLoop(objects, constructor) {
	/** @type {T[]} */
	const objectInstances = [];

	for (let object of objects) {
		objectInstances.push(new constructor(object));
	}

	return objectInstances;
}
