"use strict";

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
}
