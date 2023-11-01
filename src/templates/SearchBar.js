"use strict";

import { ArrayAdapter } from "../adapter";
import { CreateElement } from "./CreateElement";

/**
 * Event Type for Search Bar
 * @typedef {'input' | 'submit' | 'click'} SearchBarEventType
 */

export class SearchBar {
	/** @type {Record<SearchBarEventType, ArrayAdapter<(event: Event | FormDataEvent) => void>>} */
	#listeners;

	/** @type {string | undefined} */
	#placeholder;

	constructor() {
		this.#listeners = {
			input: new ArrayAdapter(),
			submit: new ArrayAdapter(),
			click: new ArrayAdapter(),
		};
	}

	#createInputEl() {
		const input = new CreateElement()
			.addClasses("search-bar__input")
			.create("input");

		if (this.#placeholder) {
			input.placeholder = this.#placeholder;
		}

		return input;
	}

	#createCloseButton() {
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

	#createSearchButton() {
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
	 *
	 * @param {SearchBarEventType} type
	 * @param {HTMLInputElement | HTMLFormElement | HTMLButtonElement} element
	 * @param {(event: Event | FormDataEvent) => void} callback
	 * @returns {void}
	 */
	#initOnEvent(type, element, callback) {
		element.addEventListener(type, (event) => {
			callback instanceof Function && callback(event);
			this.#listeners[type].forEach((listener) => listener(event));
		});
	}

	/**
	 * Added an event listener.
	 * @param {SearchBarEventType} type
	 * @param {(event: Event | FormDataEvent) => void} callback
	 * @returns {void}
	 */
	addEventListener(type, callback) {
		this.#listeners[type].push(callback);
	}

	/** @param {string} */
	set placeholder(value) {
		this.#placeholder = value;
	}

	get placeholder() {
		return this.#placeholder;
	}

	create() {
		const inputEvent = new Event("input");

		const inputEl = this.#createInputEl();
		const searchBtn = this.#createSearchButton();
		const closeEl = this.#createCloseButton();

		const formEl = new CreateElement()
			.addChildren(inputEl, searchBtn, closeEl)
			.addClasses("search-bar")
			.create("form");

		this.#initOnEvent("input", inputEl, (e) => {
			const isTarget = e.target instanceof HTMLInputElement;
			if (!isTarget) return;

			if (e.target.value.length <= 0) {
				closeEl.classList.add("hidden");
				return;
			}
			closeEl.classList.remove("hidden");
		});

		this.#initOnEvent("submit", formEl, (e) => e.preventDefault());

		this.#initOnEvent("click", closeEl, (e) => {
			if (closeEl !== e.target) return;

			inputEl.value = "";
			inputEl.dispatchEvent(inputEvent);
			inputEl.focus();
		});

		return formEl;
	}
}
