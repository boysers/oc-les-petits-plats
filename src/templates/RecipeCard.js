"use strict";

import { Adapter } from "../adapter";
import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";
import { CreateElement } from "./CreateElement";

/** @typedef {import('../models/Recipe').Recipe} Recipe */

/** @typedef {import('../models/Ingredient').Ingredient} Ingredient */

export class RecipeCard {
	/**
	 * @param {Recipe} recipe
	 * @param {Adapter} adapter
	 */
	constructor(recipe, adapter = new Adapter()) {
		this._recipe = recipe;

		/**
		 * @template T
		 * @param {(item: Ingredient, index: number, array: Array<Ingredient>) => T} callback
		 * @returns {T[]}
		 */
		this._mapIngredients = (callback) => {
			return adapter.mapArray(this._recipe.ingredients, callback);
		};

		/** @type {HTMLElement | undefined} */
		this._card;
	}

	get recipe() {
		return this._recipe;
	}

	/**
	 * @param {Ingredient} ingredient
	 * @returns {HTMLDivElement}
	 */
	_createIngredientEl(ingredient) {
		const { name, unit, quantity: qty } = ingredient;

		const ingredientElement = new CreateElement()
			.addClasses("subtitle1")
			.addChildren(capitalizeFirstLetter(name))
			.create("p");

		const quantityElement = new CreateElement()
			.addClasses("subtitle2")
			.addChildren(qty ? (unit ? `${qty} ${unit}` : qty) : null)
			.create("p");

		return new CreateElement()
			.addChildren(ingredientElement, quantityElement)
			.create("div");
	}

	/**
	 * @param {Array<Ingredient>} ingredients
	 * @returns {HTMLDivElement}
	 */
	_createIngredientsWrapper() {
		const ingredientEls = this._mapIngredients((ingredient) =>
			this._createIngredientEl(ingredient)
		);

		return new CreateElement()
			.addChildren(ingredientEls)
			.addClasses("recipe-card__ingredients-wrapper")
			.create("div");
	}

	_createInfoEl() {
		const { name, description, ingredients } = this._recipe;

		const nameEl = new CreateElement()
			.addChildren(name)
			.addClasses("recipe-card__title")
			.create("h3");

		const titleRecetteEl = new CreateElement()
			.addChildren("Recette")
			.addClasses("recipe-card__subtitle1")
			.create("h4");

		const descriptionEl = new CreateElement()
			.addChildren(description)
			.addClasses("recipe-card__description")
			.addAttributes({ title: description })
			.create("p");

		const titleIngredientsEl = new CreateElement()
			.addChildren("Ingrédients")
			.addClasses("recipe-card__subtitle2")
			.create("h4");

		const ingredientsWrapper = this._createIngredientsWrapper(ingredients);

		return new CreateElement()
			.addClasses("recipe-card__info-wrapper")
			.addChildren(
				nameEl,
				titleRecetteEl,
				descriptionEl,
				titleIngredientsEl,
				ingredientsWrapper
			)
			.create("div");
	}

	_createCard() {
		const { image, name, time } = this._recipe;

		const imgEl = new CreateElement()
			.addAttributes({ src: image, alt: name })
			.addClasses("recipe-card__image")
			.create("img");

		const infoEl = this._createInfoEl();

		return new CreateElement()
			.addClasses("recipe-card", "recipe-card-wrapper")
			.addAttributes({ "data-time": time, "aria-hidden": "false" })
			.addChildren(imgEl, infoEl)
			.create("article");
	}

	/**
	 * @param {boolean} hidden
	 * @returns {this}
	 */
	setHidden(hidden) {
		if (!this._card && this._card.hidden !== hidden) return;
		this._card.hidden = hidden;
		this._card.setAttribute("aria-hidden", hidden ? "true" : "false");
		return this;
	}

	create() {
		this._card = this._createCard();
		return this._card;
	}
}
