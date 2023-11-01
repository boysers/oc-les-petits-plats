"use strict";

import { ArrayAdapter } from "../adapter";
import { BASE_URL } from "../constants";
import { createIngredientInstance } from "./Ingredient";

/**
 * Recipe Model
 */
export class Recipe {
	#id;

	#image;

	#name;

	#servings;

	#ingredients;

	#time;

	#description;

	#appliance;

	#ustensils;

	/**
	 * @param {import('../types').TRecipe} recipe
	 */
	constructor(recipe) {
		this.#id = recipe.id;
		this.#image = recipe.image;
		this.#name = recipe.name;
		this.#servings = recipe.servings;
		this.#ingredients = recipe.ingredients;
		this.#time = recipe.time;
		this.#description = recipe.description;
		this.#appliance = recipe.appliance;
		this.#ustensils = recipe.ustensils;
	}

	#formatTime() {
		return `${this.#time}min`;
	}

	#createImageUrl() {
		const { href } = new URL(
			`${BASE_URL}recipe-photos/${this.#image}`,
			document.location
		);

		return href;
	}

	get id() {
		return this.#id;
	}

	get image() {
		return this.#createImageUrl();
	}

	get name() {
		return this.#name;
	}

	get servings() {
		return this.#servings;
	}

	get ingredients() {
		const ingredients = new ArrayAdapter(...this.#ingredients);

		return ingredients.map((ingredient) =>
			createIngredientInstance(ingredient)
		);
	}

	get time() {
		return this.#formatTime();
	}

	get description() {
		return this.#description;
	}

	get appliance() {
		return this.#appliance.toLowerCase();
	}

	get ustensils() {
		const ustensils = new ArrayAdapter(...this.#ustensils);

		return ustensils.map((ustensil) => ustensil.toLowerCase());
	}
}

/**
 * @param {import('../types').TRecipe} dataRecipe
 * @returns {Recipe}
 */
export function createRecipeInstance(dataRecipe) {
	const recipe = new Recipe(dataRecipe);

	return recipe;
}
