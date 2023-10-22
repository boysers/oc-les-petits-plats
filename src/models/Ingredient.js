"use strict";

/**
 * @typedef {Object} TIngredient
 * @property {string} ingredient
 * @property {number} [quantity]
 * @property {string} [unit]
 */

/** Ingredient Model */
export class Ingredient {
	/** @param {TIngredient} ingredient  */
	constructor(ingredient) {
		const { ingredient: name, quantity, unit } = ingredient;

		this._ingredient = name;
		this._quantity = quantity;
		this._unit = unit;
	}

	get ingredient() {
		return this._ingredient;
	}

	get quantity() {
		return this._quantity;
	}

	get unit() {
		return this._unit;
	}
}
