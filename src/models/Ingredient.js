"use strict";

/**
 * Ingredient Model
 */
export class Ingredient {
	#ingredient;

	#quantity;

	#unit;

	/**
	 * @param {import('../types').TIngredient} ingredient
	 */
	constructor(ingredient) {
		this.#ingredient = ingredient.ingredient;
		this.#quantity = ingredient.quantity;
		this.#unit = ingredient.unit;
	}

	get name() {
		return this.#ingredient.toLowerCase();
	}

	get quantity() {
		return this.#quantity;
	}

	get unit() {
		return this.#unit;
	}
}

/**
 * Function to create an instance of ingredient.
 * @param {import('../types').TIngredient} dataIngredient
 * @returns {Ingredient}
 */
export function createIngredientInstance(dataIngredient) {
	if (!dataIngredient.ingredient) {
		throw new Error(`The ingredient key is required`);
	}

	const ingredient = new Ingredient(dataIngredient);

	return ingredient;
}
