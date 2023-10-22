"use strict";

import { Adapter } from "../adapter";
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
	/** @param {TRecipe} recipe */
	constructor(recipe) {
		const adapter = new Adapter();

		const {
			id,
			image,
			name,
			servings,
			ingredients,
			time,
			description,
			appliance,
			ustensils,
		} = recipe;

		this._id = id;
		this._image = image;
		this._name = name;
		this._servings = servings;
		this._ingredients = adapter.createInstantiateObjects(
			ingredients,
			Ingredient
		);
		this._time = time;
		this._description = description;
		this._appliance = appliance;
		this._ustensils = ustensils;
	}

	get id() {
		return this._id;
	}

	get image() {
		return `/recipe-photos/${this._image}`;
	}

	get name() {
		return this._name;
	}

	get servings() {
		return this._servings;
	}

	get ingredients() {
		return this._ingredients;
	}

	get time() {
		return `${this._time}min`;
	}

	get description() {
		return this._description;
	}

	get appliance() {
		return this._appliance;
	}

	get ustensils() {
		return this._ustensils;
	}
}
