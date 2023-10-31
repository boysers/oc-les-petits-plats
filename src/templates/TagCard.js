"use strict";

import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";
import { CreateElement } from "./CreateElement";

export class TagCard {
	/** @type {HTMLElement | undefined} */
	#tagCard;
	#tagname;

	/** @param {string} tag */
	constructor(tag) {
		this.#tagname = tag;
	}

	get tagname() {
		return this.#tagname;
	}

	/**
	 * @param {boolean} hidden
	 * @returns {this}
	 */
	setHidden(hidden) {
		if (!this.#tagCard && this.#tagCard?.hidden !== hidden) return;
		this.#tagCard.hidden = hidden;
		this.#tagCard.setAttribute("aria-hidden", hidden ? "true" : "false");
		return this;
	}

	create() {
		this.#tagCard = new CreateElement()
			.addChildren(capitalizeFirstLetter(this.#tagname))
			.create("p");

		return this.#tagCard;
	}
}
