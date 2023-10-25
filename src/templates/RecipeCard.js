"use strict";

import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";
import { CreateElement } from "./CreateElement";

export class RecipeCard {
	/** @param {import('../models/Recipe').Recipe} recipe  */
	constructor(recipe) {
		this._recipe = recipe;

		/** @type {HTMLElement | undefined} */
		this._card;
	}

	/**
	 * @param {import('../models/Ingredient').Ingredient} ingredients
	 * @returns {HTMLDivElement}
	 */
	_createIngredientsWrapper(ingredients) {
		return new CreateElement()
			.addChildren(
				ingredients.map(({ ingredient, quantity, unit }) => {
					const ingredientElement = new CreateElement()
						.addClasses("subtitle1")
						.addChildren(capitalizeFirstLetter(ingredient))
						.create("p");

					const quantityElement = new CreateElement()
						.addClasses("subtitle2")
						.addChildren(`${quantity ?? ""} ${unit ?? ""}`.trim())
						.create("p");

					return new CreateElement()
						.addChildren(ingredientElement, quantityElement)
						.create("div");
				})
			)
			.addClasses("recipe-card__ingredients-wrapper")
			.create("div");
	}

	get recipe() {
		return this._recipe;
	}

	get hidden() {
		return this._card.hidden;
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
		const { image, name, description, ingredients, time } = this._recipe;

		const imgEl = new CreateElement()
			.addAttributes({ src: image, alt: name })
			.addClasses("recipe-card__image")
			.create("img");

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
			.create("p");

		const titleIngredientsEl = new CreateElement()
			.addChildren("Ingrédients")
			.addClasses("recipe-card__subtitle2")
			.create("h4");

		const ingredientsWrapper = this._createIngredientsWrapper(ingredients);

		const cardInfoEl = new CreateElement()
			.addClasses("recipe-card__info-wrapper")
			.addChildren(
				nameEl,
				titleRecetteEl,
				descriptionEl,
				titleIngredientsEl,
				ingredientsWrapper
			)
			.create("div");

		this._card = new CreateElement()
			.addClasses("recipe-card", "recipe-card-wrapper")
			.addAttributes({ "data-time": time, "aria-hidden": "false" })
			.addChildren(imgEl, cardInfoEl)
			.create("article");

		return this._card;
	}
}
