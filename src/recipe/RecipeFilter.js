"use strict";

import { Adapter } from "../adapter";
import { MIN_KEYWORD_LENGTH } from "../constants";

/**
 * @typedef {Object} TagList
 * @property {Array<string>} ingredients
 * @property {Array<string>} ustensils
 * @property {Array<string>} appliances
 */

/** @typedef {import('../models/Recipe').Recipe} Recipe */

export class RecipeFilter {
	/**
	 * @param {Array<Recipe>} recipes
	 * @param {Adapter} adapter
	 */
	constructor(recipes, adapter = new Adapter()) {
		this._recipes = recipes;

		this._foreach = adapter.foreach;
		this._mapArray = adapter.mapArray;
		this._someInArray = adapter.someInArray;

		/**
		 * @param {(value: Recipe, index: number, array: Array<Recipe>) => boolean} predicate
		 * @returns {Array<Recipe>}
		 */
		this._filterRecipes = (predicate) => {
			return adapter.filterArray(this._recipes, predicate);
		};
	}

	/**
	 *
	 * @param {Set<string>} uniqueItems
	 * @param {Array<string>} itemsToCheck
	 */
	_areItemsMatch(setItems, itemsToCheck) {
		return this._someInArray(itemsToCheck, (item) => setItems.has(item));
	}

	/**
	 * Match : name, description, appliance, ingredients and ustensils
	 * @param {Recipe} recipe
	 * @param {string} keyword
	 * @returns {boolean}
	 */
	_isKeywordMatchV1(recipe, keyword) {
		return (
			keyword.length < MIN_KEYWORD_LENGTH ||
			recipe.name.toLowerCase().includes(keyword) ||
			recipe.description.toLowerCase().includes(keyword) ||
			recipe.appliance.includes(keyword) ||
			this._someInArray(recipe.ingredients, ({ ingredient }) =>
				ingredient.includes(keyword)
			) ||
			this._someInArray(recipe.ustensils, (ustensil) =>
				ustensil.includes(keyword)
			)
		);
	}

	/**
	 * Match : name, description and ingredients
	 * @param {Recipe} recipe
	 * @param {string} keyword
	 * @returns {boolean}
	 */
	_isKeywordMatchV2(recipe, keyword) {
		return (
			keyword.length < MIN_KEYWORD_LENGTH ||
			recipe.name.toLowerCase().includes(keyword) ||
			recipe.description.toLowerCase().includes(keyword) ||
			this._someInArray(recipe.ingredients, ({ ingredient }) =>
				ingredient.includes(keyword)
			)
		);
	}

	/**
	 * @param {Recipe} recipe
	 * @param {string} keyword
	 * @returns {boolean}
	 */
	_isKeywordMatch(recipe, keyword) {
		return this._isKeywordMatchV2(recipe, keyword);
	}

	/**
	 * @param {Recipe} recipe
	 * @param {Array<string>} ingredients
	 * @returns {boolean}
	 */
	_areIngredientsMatch(recipe, ingredients) {
		if (ingredients.length === 0) return true;

		const uniqueIngredients = new Set(
			this._mapArray(recipe.ingredients, ({ ingredient }) => ingredient)
		);

		return this._areItemsMatch(uniqueIngredients, ingredients);
	}

	/**
	 * @param {Recipe} recipe
	 * @param {Array<string>} ustensils
	 * @returns {boolean}
	 */
	_areUstensilsMatch(recipe, ustensils) {
		if (ustensils.length === 0) return true;
		return this._areItemsMatch(new Set(recipe.ustensils), ustensils);
	}

	/**
	 * @param {Recipe} recipe
	 * @param {Array<string>} appliances
	 * @returns {boolean}
	 */
	_isApplianceMatch(recipe, appliances) {
		if (appliances.length === 0) return true;
		return this._areItemsMatch(new Set([recipe.appliance]), appliances);
	}

	/** @param {Array<string>} arr */
	_arrayItemToLowerCase(arr) {
		return this._mapArray(arr, (item) => item.toLowerCase());
	}

	/**
	 * @param {Recipe[]} filteredRecipes
	 * @returns {TagList}
	 */
	updateTagList(filteredRecipes) {
		const uniqueIngredients = new Set();
		const uniqueUstensils = new Set();
		const uniqueAppliances = new Set();

		this._foreach(filteredRecipes, (recipe) => {
			uniqueAppliances.add(recipe.appliance);
			this._foreach(recipe.ustensils, (ustensil) =>
				uniqueUstensils.add(ustensil)
			);
			this._foreach(recipe.ingredients, ({ ingredient }) =>
				uniqueIngredients.add(ingredient)
			);
		});

		return {
			ingredients: [...uniqueIngredients],
			ustensils: [...uniqueUstensils],
			appliances: [...uniqueAppliances],
		};
	}

	/**
	 * @param {string} keyword
	 * @param {Array<string>} ingredients
	 * @param {Array<string>} ustensils
	 * @param {Array<string>} appliances
	 */
	filterRecipesCombined(
		keyword = "",
		ingredients = [],
		ustensils = [],
		appliances = []
	) {
		keyword = keyword.toLowerCase();
		ingredients = this._arrayItemToLowerCase(ingredients);
		ustensils = this._arrayItemToLowerCase(ustensils);
		appliances = this._arrayItemToLowerCase(appliances);

		return this._filterRecipes((recipe) => {
			const isKeywordMatch = this._isKeywordMatch(recipe, keyword);

			const areIngredientsMatch = this._areIngredientsMatch(
				recipe,
				ingredients
			);

			const areUstensilsMatch = this._areUstensilsMatch(
				recipe,
				ustensils
			);

			const isApplianceMatch = this._isApplianceMatch(recipe, appliances);

			return (
				isKeywordMatch &&
				areIngredientsMatch &&
				areUstensilsMatch &&
				isApplianceMatch
			);
		});
	}
}
