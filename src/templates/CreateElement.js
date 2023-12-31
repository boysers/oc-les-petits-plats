"use strict";

import { ArrayAdapter } from "../adapter";
import { createElement } from "../utils";

export class CreateElement {
	/** @type {ArrayAdapter<string>} */
	#classes;

	#attributes;

	/** @type {ArrayAdapter<string | Node | Node[]>} */
	#children;

	constructor() {
		this.#classes = new ArrayAdapter();
		this.#attributes = {};
		this.#children = new ArrayAdapter();
	}

	/**
	 * @param {ArrayAdapter<string>} classes
	 * @returns {this}
	 */
	addClasses(...classes) {
		this.#classes.push(...classes);

		return this;
	}

	/**
	 * @param {Record<string, string>} attributes
	 * @returns {this}
	 */
	addAttributes(attributes) {
		ArrayAdapter.updateObject(this.#attributes, attributes);

		return this;
	}

	/**
	 * @param {ArrayAdapter<string | Node | Node[]>} children
	 * @returns {this}
	 */
	addChildren(...children) {
		this.#children.push(...children);

		return this;
	}

	/**
	 * @template {keyof HTMLElementTagNameMap} K
	 * @param {K} tagname
	 * @returns {HTMLElementTagNameMap[K]}
	 */
	create(tagname) {
		const element = createElement(
			tagname,
			{
				id: this._id,
				classes: this.#classes,
				attributes: this.#attributes,
			},
			...this.#children
		);

		return element;
	}
}
