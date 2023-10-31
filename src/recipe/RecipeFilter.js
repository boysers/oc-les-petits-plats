"use strict";

import { ArrayAdapter } from "../adapter";
import { MIN_KEYWORD_LENGTH } from "../constants";

/**
 * @typedef {Object} TagList
 * @property {ArrayAdapter<string>} ingredients
 * @property {ArrayAdapter<string>} ustensils
 * @property {ArrayAdapter<string>} appliances
 */

/** @typedef {import('../models/Recipe').Recipe} Recipe */

export class RecipeFilter {
	#recipes;

	/**
	 * @param {ArrayAdapter<Recipe>} recipes
	 */
	constructor(recipes) {
		this.#recipes = recipes;
	}

	/**
	 *
	 * @param {Set<string>} itemSet
	 * @param {ArrayAdapter<string>} itemsToCheck
	 * @returns {boolean}
	 */
	#areItemsMatch(itemSet, itemsToCheck) {
		return itemsToCheck.some((item) => itemSet.has(item));
	}

	/**
	 * Match : name, description and ingredients
	 * @param {Recipe} recipe
	 * @param {string} keyword
	 * @returns {boolean}
	 */
	#isKeywordMatch(recipe, keyword) {
		return (
			recipe.name.toLowerCase().includes(keyword) ||
			recipe.description.toLowerCase().includes(keyword) ||
			recipe.ingredients.some(({ name }) => name.includes(keyword))
		);
	}

	/**
	 * @param {Recipe} recipe
	 * @param {ArrayAdapter<string>} ingredients
	 * @returns {boolean}
	 */
	#areIngredientsMatch(recipe, ingredients) {
		const uniqueIngredients = new Set(
			recipe.ingredients.map(({ name }) => name)
		);

		return this.#areItemsMatch(uniqueIngredients, ingredients);
	}

	/**
	 * @param {Recipe} recipe
	 * @param {ArrayAdapter<string>} ustensils
	 * @returns {boolean}
	 */
	#areUstensilsMatch(recipe, ustensils) {
		return this.#areItemsMatch(new Set(recipe.ustensils), ustensils);
	}

	/**
	 * @param {Recipe} recipe
	 * @param {ArrayAdapter<string>} appliances
	 * @returns {boolean}
	 */
	#isApplianceMatch(recipe, appliances) {
		return this.#areItemsMatch(new Set([recipe.appliance]), appliances);
	}

	/** @param {ArrayAdapter<string>} array */
	#arrayItemToLowerCase(array) {
		return array.map((item) => item.toLowerCase());
	}

	/**
	 * @param {ArrayAdapter<Recipe>} filteredRecipes
	 * @returns {TagList}
	 */
	updateTagList(filteredRecipes) {
		const uniqueIngredients = new Set();
		const uniqueUstensils = new Set();
		const uniqueAppliances = new Set();

		filteredRecipes.forEach((recipe) => {
			uniqueAppliances.add(recipe.appliance);

			recipe.ustensils.forEach((ustensil) =>
				uniqueUstensils.add(ustensil)
			);

			recipe.ingredients.forEach(({ name }) =>
				uniqueIngredients.add(name)
			);
		});

		return {
			ingredients: new ArrayAdapter(...uniqueIngredients),
			ustensils: new ArrayAdapter(...uniqueUstensils),
			appliances: new ArrayAdapter(...uniqueAppliances),
		};
	}

	/**
	 *
	 * @param {string} keyword
	 * @param {ArrayAdapter<string>} ingredients
	 * @param {ArrayAdapter<string>} ustensils
	 * @param {ArrayAdapter<string>} appliances
	 * @returns {ArrayAdapter<Recipe>}
	 */
	filterRecipesCombined(
		keyword = "",
		ingredients = new ArrayAdapter(),
		ustensils = new ArrayAdapter(),
		appliances = new ArrayAdapter()
	) {
		keyword = keyword.toLowerCase();
		ingredients = this.#arrayItemToLowerCase(ingredients);
		ustensils = this.#arrayItemToLowerCase(ustensils);
		appliances = this.#arrayItemToLowerCase(appliances);

		return this.#recipes.filter((recipe) => {
			const isKeywordMatch =
				keyword.length < MIN_KEYWORD_LENGTH ||
				this.#isKeywordMatch(recipe, keyword);

			const areIngredientsMatch =
				ingredients.length === 0 ||
				this.#areIngredientsMatch(recipe, ingredients);

			const areUstensilsMatch =
				ustensils.length === 0 ||
				this.#areUstensilsMatch(recipe, ustensils);

			const isApplianceMatch =
				appliances.length === 0 ||
				this.#isApplianceMatch(recipe, appliances);

			return (
				isKeywordMatch &&
				areIngredientsMatch &&
				areUstensilsMatch &&
				isApplianceMatch
			);
		});
	}
}
