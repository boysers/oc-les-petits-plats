"use strict";

import { Adapter } from "../adapter";
import { RecipeCard } from "./RecipeCard";
import { SearchBar } from "./SearchBar";

/** Search recipe form template */
export class SearchRecipeForm {
	/** @param {Array<import('../models/Recipe').Recipe>} recipes */
	constructor(recipes) {
		this._adapter = new Adapter();

		this._recipes = recipes;

		this._keyword = "";

		this._recipeCards = this._adapter.createInstantiateObjects(
			this._recipes,
			RecipeCard
		);

		this._recipesWrapper = document.querySelector(".recipes-wrapper");
	}

	_filterRecipeCards() {
		if (this._keyword.length < 3) {
			this._recipeCards.forEach((card) => card.setHidden(false));
			return;
		}

		this._adapter.foreach(this._recipes, (recipe, index) => {
			const shouldHide = !(
				recipe.name.toLowerCase().includes(this._keyword) ||
				recipe.description.toLowerCase().includes(this._keyword) ||
				recipe.appliance.toLowerCase().includes(this._keyword) ||
				recipe.ingredients.reduce(
					(acc, { ingredient }) =>
						acc || ingredient.toLowerCase().includes(this._keyword),
					false
				) ||
				recipe.ustensils.reduce(
					(acc, ustensils) =>
						acc || ustensils.toLowerCase().includes(this._keyword),
					false
				)
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
			// card.setHidden(true);
		});
	}
}
