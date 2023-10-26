"use strict";

import { Adapter } from "./adapter";
import { recipes } from "./data/recipes";
import { Recipe } from "./models/Recipe";
import { SearchRecipeForm } from "./templates/SearchRecipeForm";

class App {
	/** @param {Array<import('./models/Recipe').TRecipe>} recipes */
	constructor(recipes, adapter = new Adapter()) {
		this._recipes = adapter.mapArray(recipes, (recipe) =>
			Recipe.createRecipe(recipe)
		);
	}

	_main() {
		const FilterRecipes = new SearchRecipeForm(this._recipes);
		FilterRecipes.render();
	}

	render() {
		this._main();
	}
}

const app = new App(recipes);
app.render();
