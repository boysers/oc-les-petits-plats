"use strict";

import { Adapter } from "../adapter";
import { RecipeCard } from "./RecipeCard";
import { SearchBar } from "./SearchBar";

/** @typedef {import('../models/Recipe').Recipe} Recipe */

/** Search recipe form template */
export class SearchRecipeForm {
	/** @param {Array<Recipe>} recipes */
	constructor(recipes) {
		const adapter = new Adapter();

		this._recipes = recipes;

		this._keyword = "";

		this._recipeCards = adapter.createInstantiateObjects(
			this._recipes,
			RecipeCard
		);

		/**
		 * @param {(item: Recipe, index: number, array: Array<Recipe> ) => void} callback
		 */
		this._forEachRecipes = (callback) => {
			adapter.foreach(this._recipes, callback);
		};

		/**
		 * @param {(item: RecipeCard, index: number, array: Array<RecipeCard> ) => void} callback
		 */
		this._forEachRecipeCards = (callback) => {
			adapter.foreach(this._recipeCards, callback);
		};

		this._someInArray = adapter.someInArray;
		this._mapArray = adapter.mapArray;

		this._recipesWrapper = document.querySelector(".recipes-wrapper");
	}

	_includesKeyword(text) {
		return text.toLowerCase().includes(this._keyword);
	}

	_filterRecipeCards() {
		if (this._keyword.length < 3) {
			this._forEachRecipeCards((card) => card.setHidden(false));
			return;
		}

		this._forEachRecipes((recipe, index) => {
			const { name, description, appliance, ingredients, ustensils } =
				recipe;

			const ingredientsTexts = this._mapArray(
				ingredients,
				({ ingredient }) => ingredient
			);

			const shouldHide = !this._someInArray(
				[
					name,
					description,
					appliance,
					...ustensils,
					...ingredientsTexts,
				],
				(text) => this._includesKeyword(text)
			);

			this._recipeCards[index].setHidden(shouldHide);
		});
	}

	render() {
		const headerSearchBar = new SearchBar();
		headerSearchBar.addEventListener("input", (e) => {
			const isTarget = e.target instanceof HTMLInputElement;
			if (!isTarget) return;

			const value = e.target.value;

			this._keyword = value.toLowerCase();

			this._filterRecipeCards();
		});

		document
			.querySelector(".header__herobanner__search-bar-wrapper")
			.appendChild(headerSearchBar.create());

		this._recipeCards.forEach((card) => {
			this._recipesWrapper.appendChild(card.create());
		});
	}
}
