"use strict";

import { Adapter } from "../adapter";
import { MIN_KEYWORD_LENGTH } from "../constants";
import { RecipeFilter } from "../recipe/RecipeFilter";
import { cleanAndNormalizeString } from "../utils/normalizeString";
import { RecipeCard } from "./RecipeCard";
import { SearchBar } from "./SearchBar";
import { TagMenu } from "./TagMenu";

/** @typedef {import('../models/Recipe').Recipe} Recipe */

/** Search recipe form template */
export class SearchRecipeForm {
	/** @param {Array<Recipe>} recipes */
	constructor(recipes, adapter = new Adapter()) {
		this._someInArray = adapter.someInArray;
		this._mapArray = adapter.mapArray;
		this._foreach = adapter.foreach;

		this._recipes = recipes;

		this._recipeFilter = new RecipeFilter(this._recipes);

		this._keyword = "";

		/**
		 * @type {Record<'ingredients'|'ustensils'|'appliances', Array<string>>}
		 */
		this._activeTags = {
			ingredients: [],
			ustensils: [],
			appliances: [],
		};

		/** @type {Record<'ingredients' | 'ustensils' | 'appliances', TagMenu>} */
		this._tagMenus = {};

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

		this._recipesWrapper = document.querySelector(".recipes-wrapper");
		this._recipeCountEl = document.querySelector("#recipe-count");
		this._tagActiveList = document.querySelector(
			".tag-controls__tag-active-list"
		);
	}

	/**
	 * @param {string} text
	 * @returns {boolean}
	 */
	_includesKeyword(text) {
		return text.toLowerCase().includes(this._keyword);
	}

	/**
	 * @param {Recipe} recipe
	 * @returns {boolean}
	 */
	_filterWithKeyword(recipe) {
		const { name, description, appliance, ingredients, ustensils } = recipe;

		const ingredientTexts = this._mapArray(
			ingredients,
			({ ingredient }) => ingredient
		);

		return this._someInArray(
			[name, description, appliance, ...ustensils, ...ingredientTexts],
			(text) => this._includesKeyword(text)
		);
	}

	_filterCardsV3() {
		this._recipeCountEl.textContent = "1500 recettes";

		const { appliances, ustensils, ingredients } = this._activeTags;

		const filteredRecipes = this._recipeFilter.filterRecipesCombined(
			this._keyword,
			ingredients,
			ustensils,
			appliances
		);

		this._forEachRecipeCards((card) => {
			if (filteredRecipes.find((r) => r.id === card.recipe.id)) {
				card.setHidden(false);
				return;
			}
			card.setHidden(true);
		});

		const updatedTagList =
			this._recipeFilter.updateTagList(filteredRecipes);

		if (
			!(this._keyword.length < MIN_KEYWORD_LENGTH) ||
			this._tagMenus.appliances.activeTags.size ||
			this._tagMenus.ingredients.activeTags.size ||
			this._tagMenus.ustensils.activeTags.size
		) {
			const count =
				filteredRecipes.length === 0
					? "0 recette"
					: filteredRecipes.length === 1
					? "1 recette"
					: filteredRecipes.length < 10
					? `0${filteredRecipes.length} recettes`
					: `${filteredRecipes.length} recettes`;

			this._recipeCountEl.textContent = count;
		}

		this._tagMenus.appliances.setHiddenTags(updatedTagList.appliances);
		this._tagMenus.ustensils.setHiddenTags(updatedTagList.ustensils);
		this._tagMenus.ingredients.setHiddenTags(updatedTagList.ingredients);
	}

	/** @returns {void} */
	_filterRecipeCards() {
		this._filterCardsV3();
	}

	_initSearchBar() {
		const headerSearchBar = new SearchBar();

		headerSearchBar.addEventListener("input", (e) => {
			const isTarget = e.target instanceof HTMLInputElement;
			if (!isTarget) return;

			const value = e.target.value;

			this._keyword = cleanAndNormalizeString(value.toLowerCase());

			this._filterRecipeCards();
		});

		document
			.querySelector(".header__herobanner__search-bar-wrapper")
			.appendChild(headerSearchBar.create());
	}

	/**
	 * Render component
	 * @returns {void}
	 */
	render() {
		this._initSearchBar();

		/** @type {Set<string>} */
		const ustensils = new Set();

		/** @type {Set<string>} */
		const appliances = new Set();

		/** @type {Set<string>} */
		const ingredients = new Set();

		this._forEachRecipeCards((card) => {
			const recipe = card.recipe;

			appliances.add(recipe.appliance);
			this._foreach(recipe.ustensils, (ustensil) =>
				ustensils.add(ustensil)
			);
			this._foreach(recipe.ingredients, ({ ingredient }) =>
				ingredients.add(ingredient)
			);

			this._recipesWrapper.appendChild(card.create());
		});

		this._tagMenus.ingredients = new TagMenu(Array.from(ingredients));
		this._tagMenus.appliances = new TagMenu(Array.from(appliances));
		this._tagMenus.ustensils = new TagMenu(Array.from(ustensils));

		/** @type {Array<[TagMenu, string, string]>} */
		const tagMenus = [
			[this._tagMenus.ingredients, "Ingrédients", "ingredients"],
			[this._tagMenus.appliances, "Appareils", "appliances"],
			[this._tagMenus.ustensils, "Ustensiles", "ustensils"],
		];

		const tagMenuWrapper = document.querySelector(
			".tag-controls__tag-menu-wrapper"
		);

		this._foreach(tagMenus, ([tagMenu, value, key]) => {
			const menuEl = tagMenu.create(value);

			tagMenuWrapper.appendChild(menuEl);

			menuEl.addEventListener("active-tags", (e) => {
				const tags = e.detail.tags;

				if (!Array.isArray(tags)) return;

				this._activeTags[key] = tags;

				this._filterRecipeCards();
			});
		});

		const eventClose = new Event("close");

		document.addEventListener("click", (e) => {
			this._foreach(Object.values(this._tagMenus), (menu) => {
				const button = menu.button;
				const input = menu.input;

				if (!(e.target === button || e.target === input)) {
					button.dispatchEvent(eventClose);
				}
			});
		});

		this._filterRecipeCards();
	}
}
