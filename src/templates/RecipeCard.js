"use strict";

import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";
import { CreateElement } from "./CreateElement";

export class RecipeCard {
	/** @type {HTMLElement | undefined} */
	#card;
	#recipe;

	/**
	 * @param {import('../models/Recipe').Recipe} recipe
	 */
	constructor(recipe) {
		this.#recipe = recipe;
	}

	/**
	 * @param {import('../models/Ingredient').Ingredient} ingredient
	 * @returns {HTMLDivElement}
	 */
	#createIngredientEl(ingredient) {
		const { name, unit, quantity: qty } = ingredient;

		const ingredientWrapper = new CreateElement();

		const nameElement = new CreateElement()
			.addClasses("subtitle1")
			.addChildren(capitalizeFirstLetter(name))
			.create("p");

		const quantityElement = new CreateElement()
			.addClasses("subtitle2")
			.addChildren(qty ? (unit ? `${qty} ${unit}` : qty) : null)
			.create("p");

		return ingredientWrapper
			.addChildren(nameElement, quantityElement)
			.create("div");
	}

	#createIngredientsWrapper() {
		const ingredientList = new CreateElement();
		ingredientList.addClasses("recipe-card__ingredients-wrapper");

		const ingredientEls = this.#recipe.ingredients.map((ingredient) =>
			this.#createIngredientEl(ingredient)
		);

		return ingredientList.addChildren(ingredientEls).create("div");
	}

	#createInfoEl() {
		const { name, description, ingredients } = this.#recipe;

		const infoWrapper = new CreateElement();
		infoWrapper.addClasses("recipe-card__info-wrapper");

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

		const ingredientsWrapper = this.#createIngredientsWrapper(ingredients);

		return infoWrapper
			.addChildren(
				nameEl,
				titleRecetteEl,
				descriptionEl,
				titleIngredientsEl,
				ingredientsWrapper
			)
			.create("div");
	}

	#createCard() {
		const { image, name, time } = this.#recipe;

		const cardEl = new CreateElement();
		cardEl
			.addClasses("recipe-card", "recipe-card-wrapper")
			.addAttributes({ "data-time": time, "aria-hidden": "false" });

		const imgEl = new CreateElement()
			.addAttributes({ src: image, alt: name })
			.addClasses("recipe-card__image")
			.create("img");

		const infoEl = this.#createInfoEl();

		return cardEl.addChildren(imgEl, infoEl).create("article");
	}

	/**
	 * @param {boolean} hidden
	 * @returns {this}
	 */
	setHidden(hidden) {
		if (!this.#card && this.#card.hidden !== hidden) return;

		this.#card.hidden = hidden;
		this.#card.setAttribute("aria-hidden", hidden ? "true" : "false");

		return this;
	}

	get recipe() {
		return this.#recipe;
	}

	create() {
		this.#card = this.#createCard();

		return this.#card;
	}
}
