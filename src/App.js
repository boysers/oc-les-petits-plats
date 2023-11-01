"use strict";

import { ArrayAdapter } from "./adapter";
import { dataRecipes } from "./data";
import { createRecipeInstance } from "./models";
import { SearchRecipeForm } from "./templates";

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
