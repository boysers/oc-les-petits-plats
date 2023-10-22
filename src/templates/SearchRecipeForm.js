"use strict";

import { Adapter } from "../adapter";
import { RecipeCard } from "./RecipeCard";

/** Search recipe form template */
export class SearchRecipeForm {
	/** @param {Array<import('../models/Recipe').Recipe>} recipes */
	constructor(recipes) {
		const adapter = new Adapter();

		this._recipeCards = adapter.createInstantiateObjects(
			recipes,
			RecipeCard
		);

		this._recipesWrapper = document.querySelector(".recipes-wrapper");
	}

	_filterRecipeCards() {}

	render() {
		this._recipeCards.forEach((card) => {
			this._recipesWrapper.appendChild(card.create());
			// card.setHidden(true);
		});
	}
}
