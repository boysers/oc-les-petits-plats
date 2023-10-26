"use strict";

import { Adapter } from "../adapter";
import { BASE_URL } from "../constants";
import { Ingredient } from "./Ingredient";

/**
 * @typedef {Object} TRecipe
 * @property {number} id
 * @property {string} image
 * @property {string} name
 * @property {number} servings
 * @property {Array<Ingredient>} ingredients
 * @property {number} time
 * @property {string} description
 * @property {string} appliance
 * @property {Array<string>} ustensils
 */

/** Recipe Model */
export class Recipe {
	/**
	 * @param {TRecipe} recipe
	 * @param {Adapter} adapter
	 * @returns {Recipe}
	 */
	static createRecipe(recipe, adapter = new Adapter()) {
		return new Recipe(recipe, adapter);
	}

	/**
	 * @param {TRecipe} recipe
	 * @param {Adapter} adapter
	 */
	constructor(recipe, adapter = new Adapter()) {
		this._mapArray = adapter.mapArray;

		this._id = recipe.id;
		this._image = recipe.image;
		this._name = recipe.name;
		this._servings = recipe.servings;
		this._ingredients = recipe.ingredients;
		this._time = recipe.time;
		this._description = recipe.description;
		this._appliance = recipe.appliance;
		this._ustensils = recipe.ustensils;
	}

	_formatTime() {
		return `${this._time}min`;
	}

	_getImageUrl() {
		const { href } = new URL(
			`${BASE_URL}recipe-photos/${this._image}`,
			document.location
		);
		return href;
	}

	get id() {
		return this._id;
	}

	get image() {
		return this._getImageUrl();
	}

	get name() {
		return this._name;
	}

	get servings() {
		return this._servings;
	}

	get ingredients() {
		return this._mapArray(this._ingredients, (ingredient) =>
			Ingredient.createIngredient(ingredient)
		);
	}

	get time() {
		return this._formatTime();
	}

	get description() {
		return this._description;
	}

	get appliance() {
		return this._appliance.toLowerCase();
	}

	get ustensils() {
		return this._mapArray(this._ustensils, (ustensil) =>
			ustensil.toLowerCase()
		);
	}
}
