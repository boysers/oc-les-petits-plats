"use strict";

import { isTargetAndSourceObject } from "./isTypes";

/**
 * @template T
 * @param {T} target - The target object to be updated
 * @param {T} source - The source object containing new values
 * @returns {void}
 */
export function updateObjectArrayObject(target, source) {
	if (!isTargetAndSourceObject(target, source)) return;

	Object.entries(source).forEach(([key, value]) => {
		target[key] = value;
	});
}

/**
 * @template T
 * @param {T} target - The target object to be updated
 * @param {T} source - The source object containing new values
 * @returns {void}
 */
export function updateObjectNativeLoop(target, source) {
	if (!isTargetAndSourceObject(target, source)) return;

	for (let [key, value] of Object.entries(source)) {
		target[key] = value;
	}
}
