"use strict";

import { Adapter } from "../adapter";
import { createElement } from "../utils/createElement";

export class CreateElement {
	constructor() {
		/** @type {string | undefined} */
		this._id;

		/** @type {Array<string>} */
		this._classes = [];

		/** @type {Record<string, string>} */
		this._attributes = {};

		/** @type {Array<string | number | Node | Node[]>} */
		this._children = [];
	}

	/**
	 * @param {string} id
	 * @returns {this}
	 */
	addId(id) {
		this._id = id;
		return this;
	}

	/**
	 * @param {Array<string>} classes
	 * @returns {this}
	 */
	addClasses(...classes) {
		this._classes.push(...classes);
		return this;
	}

	/**
	 * @param {Record<string, string>} attributes
	 * @returns {this}
	 */
	addAttributes(attributes) {
		const adapter = new Adapter();
		adapter.updateObject(this._attributes, attributes);
		return this;
	}

	/**
	 * @param {Array<string | number | Node | Node[]>} children
	 * @returns {this}
	 */
	addChildren(...children) {
		this._children.push(...children);
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
				classes: this._classes,
				attributes: this._attributes,
			},
			...this._children
		);

		return element;
	}
}
