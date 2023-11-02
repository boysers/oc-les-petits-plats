"use strict";

import { ArrayAdapter } from "../adapter";
import { MIN_KEYWORD_LENGTH } from "../constants";
import { RecipesFilter, escapeHtml, normalizeString } from "../utils";
import { CreateElement } from "./CreateElement";
import { RecipeCard } from "./RecipeCard";
import { SearchBar } from "./SearchBar";

/**
 * Search recipe form template
 */
export class SearchRecipeForm {
	#recipes;

	#recipesFilter;

	#keyword;

	#recipeCards;

	#notFoundEl;

	#recipesWrapper;

	#recipeCountEl;

	#searchBar;

	/**
	 * @param {ArrayAdapter<import('../models/Recipe').Recipe>} recipes
	 */
	constructor(recipes) {
		this.#recipes = new ArrayAdapter(...recipes);
		this.#recipesFilter = new RecipesFilter(this.#recipes);
		this.#keyword = "";

		this.#searchBar = document.querySelector(
			".header__herobanner__search-bar-wrapper"
		);
		this.#recipeCountEl = document.querySelector("#recipe-count");
		this.#recipesWrapper = document.querySelector(".recipes-wrapper");

		this.#notFoundEl = new CreateElement()
			.addChildren("not found")
			.addClasses("close", "not-found")
			.create("p");

		this.#recipeCards = this.#recipes.map(
			(recipe) => new RecipeCard(recipe)
		);
	}

	#filterRecipeCards() {
		this.#resetRecipesCount();

		const filteredRecipes = this.#recipesFilter.filterOption1(
			this.#keyword
		);

		const recipesCount = filteredRecipes.length;

		this.#recipeCards.forEach((card) => {
			if (filteredRecipes.find((r) => r.id === card.recipe.id)) {
				card.setHidden(false);
				return;
			}
			card.setHidden(true);
		});

		this.#updateRecipesCount(recipesCount);

		this.#notFoundEl.classList.toggle("close", recipesCount > 0);
		if (recipesCount === 0) {
			this.#notFoundEl.innerText = `Aucune recette ne contient ‘${
				this.#keyword
			}’ vous pouvez chercher « tarte aux pommes », « poisson », etc.`;
		}
	}

	#resetRecipesCount() {
		const count = `${this.#recipeCards.length} recettes`;
		this.#recipeCountEl.textContent = count;
	}

	/**
	 * @param {number} recipesLength
	 * @returns {void}
	 */
	#updateRecipesCount(recipesLength) {
		const isKeyword = !(this.#keyword.length < MIN_KEYWORD_LENGTH);

		if (isKeyword) {
			const count =
				recipesLength === 0
					? "0 recette"
					: recipesLength === 1
					? "1 recette"
					: recipesLength < 10
					? `0${recipesLength} recettes`
					: `${recipesLength} recettes`;

			this.#recipeCountEl.textContent = count.toString();
		}
	}

	#initSearchBar() {
		const searchBar = new SearchBar();
		searchBar.placeholder = "Rechercher une recette, un ingrédient, ...";

		searchBar.addEventListener("input", (e) => {
			const isTarget = e.target instanceof HTMLInputElement;
			if (!isTarget) return;

			const value = e.target.value;
			const unsafeKeyword = normalizeString(value.toLowerCase());
			this.#keyword = escapeHtml(unsafeKeyword);

			this.#filterRecipeCards();
		});

		this.#searchBar.appendChild(searchBar.create());
	}

	render() {
		if (!this.#recipesWrapper) return;

		this.#recipesWrapper.appendChild(this.#notFoundEl);

		this.#recipeCards.forEach((card) => {
			this.#recipesWrapper.appendChild(card.create());
		});

		this.#initSearchBar();
		this.#resetRecipesCount();
	}
}
