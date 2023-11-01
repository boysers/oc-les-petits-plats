"use strict";

import { ArrayAdapter } from "../adapter";

/**
 * @typedef {Object} Props
 * @property {string} [id]
 * @property {Array<string>} [classes]
 * @property {Record<string, string>} [attributes]
 */

/**
 * Creates an instance of the element for the specified tag.
 * @template {keyof HTMLElementTagNameMap} K
 * @param {K} tagname
 * @param {Props} [props]
 * @param {ArrayAdapter<string | Node | Node[]>} [children]
 * @returns {HTMLElementTagNameMap[K]}
 */
export function createElement(tagname, props = {}, ...children) {
	const element = document.createElement(tagname);

	if (
		props.classes &&
		Array.isArray(props.classes) &&
		props.classes.length > 0
	) {
		element.classList.add(...props.classes);
	}

	if (props.attributes && typeof props.attributes === "object") {
		new ArrayAdapter(...Object.entries(props.attributes)).forEach(
			([key, value]) => {
				element.setAttribute(key, value);
			}
		);
	}

	if (props.id && typeof props.id === "string") {
		element.id = props.id;
	}

	new ArrayAdapter(...children).forEach((child) => {
		if (Array.isArray(child)) {
			return element.append(...child);
		}

		if (typeof child === "string") {
			child = document.createTextNode(child);
		}

		if (child instanceof Node) {
			element.appendChild(child);
		}
	});

	return element;
}
