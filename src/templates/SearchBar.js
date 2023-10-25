"use strict";

import { CreateElement } from "./CreateElement";

/**
 * Event Type for Search Bar
 * @typedef {'input' | 'submit' | 'click'} EventType
 */

export class SearchBar {
	constructor() {
		/** @type {HTMLElement | undefined} */
		this._formControl;

		/** @type {Record<EventType, Array<(event: Event) => void>>} */
		this._listeners = {
			input: [],
			submit: [],
			click: [],
		};

		/** @type {string | undefined} */
		this._placeholder;
	}

	/**
	 * @param {HTMLInputElement} input
	 * @param {(event: Event) => void} callback
	 */
	_initOnInput(input, callback) {
		input.addEventListener("input", (e) => {
			callback instanceof Function && callback(e);
			this._listeners["input"].forEach((listener) => listener(e));
		});
	}

	/**
	 * @param {HTMLInputElement} form
	 * @param {(event: FormDataEvent) => void} [callback]
	 */
	_initOnSubmit(form, callback) {
		form.addEventListener("submit", (e) => {
			callback instanceof Function && callback(e);
			this._listeners["submit"].forEach((listener) => listener(e));
		});
	}

	/**
	 * @param {HTMLInputElement} form
	 * @param {(event: Event) => void} [callback]
	 */
	_initOnClick(cto, callback) {
		cto.addEventListener("click", (e) => {
			callback instanceof Function && callback(e);
			this._listeners["click"].forEach((listener) => listener(e));
		});
	}

	/**
	 * Added an event listener.
	 * @param {EventType} type
	 * @param {(event: Event) => void} callback
	 * @returns {void}
	 */
	addEventListener(type, callback) {
		this._listeners[type].push(callback);
	}

	/** @param {string} */
	set placeholder(value) {
		this._placeholder = value;
	}

	get placeholder() {
		return this._placeholder;
	}

	create() {
		const input = new CreateElement()
			.addClasses("search-bar__input")
			.create("input");

		if (this._placeholder) input.placeholder = this._placeholder;

		const icon = new CreateElement()
			.addClasses("fa-solid", "fa-magnifying-glass")
			.create("i");

		const button = new CreateElement()
			.addClasses("search-bar__button")
			.addChildren(icon)
			.create("button");

		const closeEl = new CreateElement()
			.addClasses("fa-solid", "fa-xmark", "close", "hidden")
			.create("i");

		this._formControl = new CreateElement()
			.addChildren(input, button, closeEl)
			.addClasses("search-bar")
			.create("form");

		closeEl.addEventListener("mouseenter", () => {
			closeEl.classList.remove("fa-xmark");
			closeEl.classList.add("fa-circle-xmark");
		});

		closeEl.addEventListener("mouseleave", () => {
			closeEl.classList.add("fa-xmark");
			closeEl.classList.remove("fa-circle-xmark");
		});

		this._initOnInput(input, (e) => {
			const isTarget = e.target instanceof HTMLInputElement;
			if (!isTarget) return;

			if (e.target.value.length <= 0) {
				closeEl.classList.add("hidden");
				return;
			}
			closeEl.classList.remove("hidden");
		});

		this._initOnSubmit(this._formControl, (e) => e.preventDefault());

		this._initOnClick(closeEl, (e) => {
			if (closeEl !== e.target) return;

			input.value = "";

			const inputEvent = new Event("input");
			input.dispatchEvent(inputEvent);

			input.focus();
		});

		return this._formControl;
	}
}
