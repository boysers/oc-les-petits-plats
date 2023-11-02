import { MIN_KEYWORD_LENGTH } from "./constants";
import { dataRecipes } from "./data";

export class Benchmark {
	#recipes;
	#keyword;
	#iterations;
	#options;

	constructor() {
		this.#recipes = dataRecipes;
		this.#keyword = "";
		this.#iterations = 25000;

		this.#options = {
			option1: true,
			option2: true,
		};
	}

	/** @param {boolean} */
	set option1(bool) {
		this.#options["option1"] = bool;
	}

	get option1() {
		return this.#options["option1"];
	}

	/** @param {boolean} */
	set option2(bool) {
		this.#options["option2"] = bool;
	}

	get option2() {
		return this.#options["option2"];
	}

	/** @param {string} */
	set keyword(str) {
		this.#keyword = str.toLowerCase();
	}

	/** @param {string} */
	get keyword() {
		return this.#keyword;
	}

	/** @param {number} */
	set iterations(count) {
		this.#iterations = count;
	}

	get iterations() {
		return this.#iterations;
	}

	/**
	 * @param {string} keyword
	 * @returns {Array<import('./types').TRecipe>}
	 */
	#filterOption1(keyword) {
		if (keyword.length < MIN_KEYWORD_LENGTH) {
			return this.#recipes;
		}

		const recipesLength = this.#recipes.length;

		const filteredRecipes = [];
		let filteredIndex = 0;

		for (let recipeIndex = 0; recipeIndex < recipesLength; recipeIndex++) {
			const recipe = this.#recipes[recipeIndex];

			if (
				recipe.name.toLowerCase().includes(keyword) ||
				recipe.description.toLowerCase().includes(keyword)
			) {
				filteredRecipes[filteredIndex++] = recipe;
				continue;
			}

			const ingredientsLength = recipe.ingredients.length;
			for (let index = 0; index < ingredientsLength; index++) {
				const ingredient = recipe.ingredients[index];

				if (ingredient.ingredient.toLowerCase().includes(keyword)) {
					filteredRecipes[filteredIndex++] = recipe;
					break;
				}
			}
		}

		return filteredRecipes;
	}

	/**
	 * @param {string} keyword
	 * @returns {Array<import('./types').TRecipe>}
	 */
	#filterOption2(keyword) {
		if (keyword.length < MIN_KEYWORD_LENGTH) {
			return this.#recipes;
		}

		const filteredRecipes = this.#recipes.filter(
			({ name, description, ingredients }) =>
				name.toLowerCase().includes(keyword) ||
				description.toLowerCase().includes(keyword) ||
				ingredients.some(({ ingredient }) =>
					ingredient.includes(keyword)
				)
		);

		return filteredRecipes;
	}

	/**
	 * @param {number} optionNumber
	 * @param {(keyword: string) => void} filterFunc
	 */
	#bench(optionNumber, filterFunc) {
		const startTime = performance.now();

		for (let i = 0; i < 25000; i++) {
			filterFunc(this.#keyword);
		}

		const endTime = performance.now();

		const executionTime = Math.round((endTime - startTime) * 100) / 100;

		const opsPerSecond =
			Math.round((this.#iterations / executionTime) * 1000) / 1000;

		console.log(
			`Option ${optionNumber} : ${opsPerSecond} ops/s | ${executionTime} millisecondes`
		);
	}

	#option1() {
		this.#bench(1, this.#filterOption1.bind(this));
	}

	#option2() {
		this.#bench(2, this.#filterOption2.bind(this));
	}

	render() {
		console.group("Benchmark");
		this.#options["option1"] && this.#option1();
		this.#options["option2"] && this.#option2();
		console.groupEnd("Benchmark");
	}
}
