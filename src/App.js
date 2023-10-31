"use strict";

import { ArrayAdapter } from "./adapter";
import { recipes as dataRecipes } from "./data/recipes";
import { createRecipeInstance } from "./models/Recipe";
import { SearchRecipeForm } from "./templates/SearchRecipeForm";

class App {
	#recipes;

	constructor() {
		const recipes = new ArrayAdapter(...dataRecipes);
		this.#recipes = recipes.map((recipe) => createRecipeInstance(recipe));
	}

	#main() {
		const searchRecipeForm = new SearchRecipeForm(this.#recipes);
		searchRecipeForm.render();
	}

	render() {
		this.#main();
	}
}

const app = new App();
app.render();
