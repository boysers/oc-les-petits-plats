"use strict";

import { Adapter } from "../adapter";
import { createElement } from "../utils/createElement";

export class CreateElement {
	/** @param {keyof HTMLElementTagNameMap} tagname */
	constructor(tagname) {
		this._tagname = tagname;

		/** @type {Array<string>} */
		this._classes = [];

		/** @type {Array<string | number | Node | Node[]>} */
		this._children = [];

		/** @type {Record<string, string>} */
		this._attributes = {};

		/** @type {string | undefined} */
		this._id;
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
	 * @param {string} id
	 * @returns {this}
	 */
	addId(id) {
		this._id = id;
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

	create() {
		const element = createElement(
			this._tagname,
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
