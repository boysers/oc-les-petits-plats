"use strict";

import { CreateElement } from "./CreateElement";

/**
 * Event Type for Search Bar
 * @typedef {'input' | 'submit' | 'click'} EventType
 */

export class SearchBar {
	constructor() {
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

	_createInputEl() {
		const input = new CreateElement()
			.addClasses("search-bar__input")
			.create("input");

		if (this._placeholder) {
			input.placeholder = this._placeholder;
		}

		return input;
	}

	_createCloseButton() {
		const closeButton = new CreateElement()
			.addClasses("fa-solid", "fa-xmark", "close", "hidden")
			.create("i");

		closeButton.addEventListener("mouseenter", () => {
			closeButton.classList.remove("fa-xmark");
			closeButton.classList.add("fa-circle-xmark");
		});

		closeButton.addEventListener("mouseleave", () => {
			closeButton.classList.add("fa-xmark");
			closeButton.classList.remove("fa-circle-xmark");
		});

		return closeButton;
	}

	_createSearchButton() {
		const searchIcon = new CreateElement()
			.addClasses("fa-solid", "fa-magnifying-glass")
			.create("i");

		const button = new CreateElement()
			.addClasses("search-bar__button")
			.addChildren(searchIcon)
			.create("button");

		return button;
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
		const inputEvent = new Event("input");

		const inputEl = this._createInputEl();
		const searchBtn = this._createSearchButton();
		const closeEl = this._createCloseButton();

		const formControl = new CreateElement()
			.addChildren(inputEl, searchBtn, closeEl)
			.addClasses("search-bar")
			.create("form");

		this._initOnInput(inputEl, (e) => {
			const isTarget = e.target instanceof HTMLInputElement;
			if (!isTarget) return;

			if (e.target.value.length <= 0) {
				closeEl.classList.add("hidden");
				return;
			}
			closeEl.classList.remove("hidden");
		});

		this._initOnSubmit(formControl, (e) => e.preventDefault());

		this._initOnClick(closeEl, (e) => {
			if (closeEl !== e.target) return;

			inputEl.value = "";
			inputEl.dispatchEvent(inputEvent);
			inputEl.focus();
		});

		return formControl;
	}
}
