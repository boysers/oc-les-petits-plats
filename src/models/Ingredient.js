"use strict";

/**
 * @typedef {Object} TIngredient
 * @property {string} ingredient
 * @property {number} [quantity]
 * @property {string} [unit]
 */

/** Ingredient Model */
export class Ingredient {
	/**
	 * @param {TIngredient} data
	 * @returns {Ingredient}
	 */
	static createIngredient(data) {
		if (!data.ingredient) {
			throw new Error(`The ingredient key is required`);
		}

		return new Ingredient(data);
	}

	/** @param {TIngredient} ingredient  */
	constructor(ingredient) {
		this._ingredient = ingredient.ingredient;
		this._quantity = ingredient.quantity;
		this._unit = ingredient.unit;
	}

	get ingredient() {
		return this._ingredient.toLowerCase();
	}

	get quantity() {
		return this._quantity;
	}

	get unit() {
		return this._unit;
	}
}
