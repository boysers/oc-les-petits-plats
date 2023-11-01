"use strict";

import { ArrayAdapter } from "../adapter";
import { MIN_KEYWORD_LENGTH } from "../constants";
import { RecipeFilter } from "../recipe/RecipeFilter";
import { cleanAndNormalizeString } from "../utils/normalizeString";
import { CreateElement } from "./CreateElement";
import { RecipeCard } from "./RecipeCard";
import { SearchBar } from "./SearchBar";
import { TagMenu } from "./TagMenu";

/** @typedef {import('../models/Recipe').Recipe} Recipe */

/** Search recipe form template */
export class SearchRecipeForm {
	#recipes;

	#recipeFilter;

	#keyword;

	/** @type {Record<'ingredients'|'ustensils'|'appliances', ArrayAdapter<string>>} */
	#activeTags;

	/** @type {Record<'ingredients' | 'ustensils' | 'appliances', TagMenu>} */
	#tagMenus;

	#recipeCards;

	#recipesWrapper;

	#recipeCountEl;

	#notFoundEl;

	/**
	 * @param {ArrayAdapter<Recipe>} recipes
	 */
	constructor(recipes) {
		this.#recipes = new ArrayAdapter(...recipes);

		this.#recipeFilter = new RecipeFilter(this.#recipes);

		this.#keyword = "";

		this.#activeTags = {
			ingredients: new ArrayAdapter(),
			ustensils: new ArrayAdapter(),
			appliances: new ArrayAdapter(),
		};

		this.#tagMenus = {};

		this.#recipesWrapper = document.querySelector(".recipes-wrapper");
		this.#recipeCountEl = document.querySelector("#recipe-count");

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

		const { appliances, ustensils, ingredients } = this.#activeTags;

		const filteredRecipes = this.#recipeFilter.filterRecipesCombined(
			this.#keyword,
			ingredients,
			ustensils,
			appliances
		);

		this.#recipeCards.forEach((card) => {
			if (filteredRecipes.find((r) => r.id === card.recipe.id)) {
				card.setHidden(false);
				return;
			}
			card.setHidden(true);
		});

		const updatedTagList =
			this.#recipeFilter.updateTagList(filteredRecipes);

		if (
			!(this.#keyword.length < MIN_KEYWORD_LENGTH) ||
			this.#tagMenus.appliances.activeTags.size ||
			this.#tagMenus.ingredients.activeTags.size ||
			this.#tagMenus.ustensils.activeTags.size
		) {
			const count =
				filteredRecipes.length === 0
					? "0 recette"
					: filteredRecipes.length === 1
					? "1 recette"
					: filteredRecipes.length < 10
					? `0${filteredRecipes.length} recettes`
					: `${filteredRecipes.length} recettes`;

			this.#recipeCountEl.textContent = count;
		}

		if (!filteredRecipes.length) {
			this.#notFoundEl.classList.remove("close");
			this.#notFoundEl.innerText = `Aucune recette ne contient ‘${
				this.#keyword
			}’ vous pouvez chercher « tarte aux pommes », « poisson », etc.`;
		} else {
			this.#notFoundEl.classList.add("close");
		}

		console.log(updatedTagList.appliances);

		this.#tagMenus.appliances.setHiddenTags(updatedTagList.appliances);
		this.#tagMenus.ustensils.setHiddenTags(updatedTagList.ustensils);
		this.#tagMenus.ingredients.setHiddenTags(updatedTagList.ingredients);
	}

	#resetRecipesCount() {
		const count = `${this.#recipeCards.length} recettes`;
		this.#recipeCountEl.textContent = count;
	}

	#initSearchBar() {
		const searchBar = new SearchBar();
		searchBar.placeholder = "Rechercher une recette, un ingrédient, ...";

		searchBar.addEventListener("input", (e) => {
			const isTarget = e.target instanceof HTMLInputElement;
			if (!isTarget) return;

			const value = e.target.value;

			this.#keyword = cleanAndNormalizeString(value.toLowerCase());

			this.#filterRecipeCards();
		});

		document
			.querySelector(".header__herobanner__search-bar-wrapper")
			.appendChild(searchBar.create());
	}

	/**
	 * @param {Set<string>} uniqueIngredients
	 * @param {Set<string>} uniqueAppliances
	 * @param {Set<string>} uniqueUstensils
	 * @returns {void}
	 */
	#initMenus(uniqueIngredients, uniqueAppliances, uniqueUstensils) {
		const tagMenuWrapper = document.querySelector(
			".tag-controls__tag-menu-wrapper"
		);

		const eventClose = new Event("close");

		this.#tagMenus.ingredients = new TagMenu(
			new ArrayAdapter(...uniqueIngredients)
		);
		this.#tagMenus.appliances = new TagMenu(
			new ArrayAdapter(...uniqueAppliances)
		);
		this.#tagMenus.ustensils = new TagMenu(
			new ArrayAdapter(...uniqueUstensils)
		);

		/** @type {ArrayAdapter<[TagMenu, string, string]>} */
		const tagMenus = new ArrayAdapter(
			[this.#tagMenus.ingredients, "Ingrédients", "ingredients"],
			[this.#tagMenus.appliances, "Appareils", "appliances"],
			[this.#tagMenus.ustensils, "Ustensiles", "ustensils"]
		);

		tagMenus.forEach(([tagMenu, value, key]) => {
			const menuEl = tagMenu.create(value);

			tagMenuWrapper.appendChild(menuEl);

			menuEl.addEventListener("active-tags", (e) => {
				const tags = e.detail.tags;

				if (!Array.isArray(tags)) return;

				this.#activeTags[key] = new ArrayAdapter(...tags);

				this.#filterRecipeCards();
			});
		});

		document.addEventListener("click", (event) =>
			new ArrayAdapter(...Object.values(this.#tagMenus)).forEach(
				(menu) => {
					const button = menu.button;
					const input = menu.input;

					if (!(event.target === button || event.target === input)) {
						button.dispatchEvent(eventClose);
					}
				}
			)
		);
	}

	render() {
		const uniqueIngredients = new Set();
		const uniqueAppliances = new Set();
		const uniqueUstensils = new Set();

		this.#recipesWrapper.appendChild(this.#notFoundEl);

		this.#recipeCards.forEach((card) => {
			const recipe = card.recipe;

			uniqueAppliances.add(recipe.appliance);
			recipe.ingredients.forEach(({ name }) =>
				uniqueIngredients.add(name)
			);
			recipe.ustensils.forEach((ustensil) =>
				uniqueUstensils.add(ustensil)
			);

			this.#recipesWrapper.appendChild(card.create());
		});

		this.#initSearchBar();
		this.#initMenus(uniqueIngredients, uniqueAppliances, uniqueUstensils);

		this.#resetRecipesCount();
	}
}
