"use strict";

import { Adapter } from "../adapter";
import { createElement } from "../utils/createElement";

export class CreateElement {
	/** @param {Adapter} adapter */
	constructor(adapter = new Adapter()) {
		this._updateObject = adapter.updateObject;

		/** @type {Array<string>} */
		this._classes = [];

		/** @type {Record<string, string>} */
		this._attributes = {};

		/** @type {Array<string | number | Node | Node[]>} */
		this._children = [];
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
		this._updateObject(this._attributes, attributes);
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
