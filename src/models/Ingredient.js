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
	 * @param {TIngredient} dataIngredient
	 * @returns {Ingredient}
	 */
	static createIngredient(dataIngredient) {
		if (!dataIngredient.ingredient) {
			throw new Error(`The ingredient key is required`);
		}

		return new Ingredient(dataIngredient);
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
