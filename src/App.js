"use strict";

import { Adapter } from "./adapter";
import { recipes } from "./data/recipes";
import { Recipe } from "./models/Recipe";
import { RecipeFilter } from "./recipe/RecipeFilter";
import { SearchRecipeForm } from "./templates/SearchRecipeForm";

class App {
	/** @param {Array<import('./models/Recipe').TRecipe>} recipes */
	constructor(recipes, adapter = new Adapter()) {
		this._recipes = adapter.createInstantiateObjects(recipes, Recipe);
	}

	_test() {
		const recipeFilter = new RecipeFilter(this._recipes);

		const filteredRecipes = recipeFilter.filterRecipesCombined(
			"",
			["poulet"],
			["couteau"],
			[]
		);

		const updatedTagList = recipeFilter.updateTagList(filteredRecipes);

		console.log("filtered recipes :", filteredRecipes);
		console.log("updated taglist :", updatedTagList);
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
