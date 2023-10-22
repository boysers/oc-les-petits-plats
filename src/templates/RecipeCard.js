"use strict";

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
		return new CreateElement("div")
			.addChildren(
				ingredients.map(({ ingredient, quantity, unit }) => {
					const wrapper = new CreateElement("div");

					const ingredientElement = new CreateElement("p")
						.addClasses("subtitle1")
						.addChildren(ingredient)
						.create();

					const quantityElement = new CreateElement("p")
						.addClasses("subtitle2")
						.addChildren(`${quantity ?? ""} ${unit ?? ""}`.trim())
						.create();

					return wrapper
						.addChildren(ingredientElement, quantityElement)
						.create();
				})
			)
			.addClasses("recipe-card__ingredients-wrapper")
			.create();
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
		const card = new CreateElement("article");

		const { image, name, description, ingredients, time } = this._recipe;

		const imgEl = new CreateElement("img")
			.addAttributes({ src: image, alt: name })
			.addClasses("recipe-card__image")
			.create();

		const nameEl = new CreateElement("h3")
			.addChildren(name)
			.addClasses("recipe-card__title")
			.create();

		const titleRecetteEl = new CreateElement("h4")
			.addChildren("Recette")
			.addClasses("recipe-card__subtitle1")
			.create();

		const descriptionEl = new CreateElement("p")
			.addChildren(description)
			.addClasses("recipe-card__description")
			.create();

		const titleIngredientsEl = new CreateElement("h4")
			.addChildren("Ingrédients")
			.addClasses("recipe-card__subtitle2")
			.create();

		const ingredientsWrapper = this._createIngredientsWrapper(ingredients);

		const cardInfoEl = new CreateElement("div")
			.addClasses("recipe-card__info-wrapper")
			.addChildren(
				nameEl,
				titleRecetteEl,
				descriptionEl,
				titleIngredientsEl,
				ingredientsWrapper
			)
			.create();

		this._card = card
			.addClasses("recipe-card", "recipe-card-wrapper")
			.addAttributes({ "data-time": time, "aria-hidden": "false" })
			.addChildren(imgEl, cardInfoEl)
			.create();

		return this._card;
	}
}
