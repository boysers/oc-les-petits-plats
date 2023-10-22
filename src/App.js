"use strict";

import { Adapter } from "./adapter";
import { recipes } from "./data/recipes";
import { Recipe } from "./models/Recipe";
import { SearchRecipeForm } from "./templates/SearchRecipeForm";

class App {
	/** @param {import('./models/Recipe').TRecipe} recipes */
	constructor(recipes) {
		const adapter = new Adapter();

		this._recipes = adapter.createInstantiateObjects(recipes, Recipe);
	}

	render() {
		const FilterRecipes = new SearchRecipeForm(this._recipes);

		FilterRecipes.render();
	}
}

const app = new App(recipes);
app.render();
