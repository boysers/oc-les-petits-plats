"use strict";

import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";
import { CreateElement } from "./CreateElement";

export class TagCard {
	/** @param {string} tag */
	constructor(tag) {
		this._tagname = tag;

		/** @type {HTMLElement | undefined} */
		this._tagCard;
	}

	get tagname() {
		return this._tagname;
	}

	/**
	 * @param {boolean} hidden
	 * @returns {this}
	 */
	setHidden(hidden) {
		if (!this._tagCard && this._tagCard?.hidden !== hidden) return;
		this._tagCard.hidden = hidden;
		this._tagCard.setAttribute("aria-hidden", hidden ? "true" : "false");
		return this;
	}

	/** @returns {HTMLElement} */
	create() {
		this._tagCard = new CreateElement()
			.addChildren(capitalizeFirstLetter(this._tagname))
			.create("p");

		return this._tagCard;
	}
}
