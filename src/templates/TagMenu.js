"use strict";

import { Adapter } from "../adapter";
import { cleanAndNormalizeString } from "../utils/normalizeString";
import { CreateElement } from "./CreateElement";
import { SearchBar } from "./SearchBar";
import { TagCard } from "./TagCard";

/**
 * Event Type for Search Bar
 * @typedef {'click'} EventType
 */

export class TagMenu {
	/** @param {Array<string>} tags */
	constructor(tags) {
		const adapter = new Adapter();
		this._mapArray = adapter.mapArray;
		this._someInArray = adapter.someInArray;
		this._foreach = adapter.foreach;

		/** @type {HTMLElement | undefined} */
		this._tagMenu;

		this._keyword = "";

		this._tags = tags;

		/** @type {Array<string>} */
		this._hiddenTags = [];

		/** @type {HTMLElement} */
		this._button;

		this._tagCards = adapter.createInstantiateObjects(this._tags, TagCard);

		/** @type {Set<string>} */
		this._activeTags = new Set();

		/**
		 * @param {(item: string, index: number, array: Array<string> ) => void} callback
		 */
		this._forEachTag = (callback) => {
			adapter.foreach(this._tags, callback);
		};

		/**
		 * @param {(item: TagCard, index: number, array: Array<TagCard> ) => void} callback
		 */
		this._forEachTagCards = (callback) => {
			adapter.foreach(this._tagCards, callback);
		};

		/** @type {Record<EventType, Array<(event: Event) => void | (event: Event, activeTags: Array<string>) => void>>} */
		this._listeners = {
			click: [],
		};

		this._eventActiveTags = new CustomEvent("active-tags", {
			detail: { tags: [...this._activeTags] },
		});

		this._isOpen = false;
	}

	/** @returns {void} */
	_filterTagCards() {
		const uniqueTags = new Set(this._hiddenTags);

		this._foreach(this._tags, (tag, index) => {
			const shouldHide =
				!tag.includes(this._keyword) ||
				this._activeTags.has(tag) ||
				!uniqueTags.has(tag);

			this._tagCards[index].setHidden(shouldHide);
		});
	}

	_filterTagV1() {
		this._forEachTag((tag, index) => {
			const shouldHide =
				this._activeTags.has(tag) ||
				!tag.toLowerCase().includes(this._keyword) ||
				this._someInArray(this._hiddenTags, (hiddenTag) =>
					hiddenTag.includes(tag)
				);

			this._tagCards[index].setHidden(!shouldHide);
		});
	}

	_updateActiveTags() {
		this._eventActiveTags.detail.tags = Array.from(this._activeTags);
		this._tagMenu.dispatchEvent(this._eventActiveTags);
	}

	/**
	 * @param {HTMLInputElement} element
	 * @param {(event: Event) => void} [callback]
	 */
	_initOnClick(element, callback) {
		element.addEventListener("click", (e) => {
			callback instanceof Function && callback(e);
			this._listeners["click"].forEach((listener) => listener(e));
		});
	}

	_createSearchBar() {
		const searchBar = new SearchBar();

		searchBar.addEventListener("input", (e) => {
			const isTarget = e.target instanceof HTMLInputElement;
			if (!isTarget) return;

			const value = e.target.value;

			this._keyword = cleanAndNormalizeString(value.toLowerCase());

			this._filterTagCards();
		});

		return searchBar.create();
	}

	/**
	 * @param {string} value
	 * @param {HTMLElement} collapseEl
	 * @param {HTMLElement} searchBar
	 * @returns {HTMLElement}
	 */
	_createButton(value, collapseEl, searchBar) {
		// let isOpen = false;
		let isOpen = this._isOpen;

		this._input = searchBar.querySelector("input");
		const input = this._input;

		const chevron = new CreateElement()
			.addClasses("fa-solid", "fa-chevron-down")
			.create("i");

		const button = new CreateElement()
			.addChildren(
				new CreateElement().addChildren(value).create("p"),
				chevron
			)
			.addClasses("tag-menu__button")
			.create("div");

		button.addEventListener("close", () => {
			if (isOpen) {
				isOpen = false;

				chevron.classList.remove("fa-chevron-up");
				chevron.classList.add("fa-chevron-down");

				collapseEl.classList.remove("tag-menu__collapse--open");

				this._tagMenu.classList.remove("open");

				input.value = "";
				this._keyword = "";
				this._filterTagCards();
				return;
			}
		});

		button.addEventListener("click", () => {
			if (isOpen) {
				isOpen = false;

				chevron.classList.remove("fa-chevron-up");
				chevron.classList.add("fa-chevron-down");

				collapseEl.classList.remove("tag-menu__collapse--open");

				this._tagMenu.classList.remove("open");

				input.value = "";
				this._keyword = "";
				this._filterTagCards();
				return;
			}
			isOpen = true;

			this._tagMenu.classList.add("open");

			chevron.classList.add("fa-chevron-up");
			chevron.classList.remove("fa-chevron-down");

			collapseEl.classList.add("tag-menu__collapse--open");

			input.focus();
		});

		this._button = button;

		return button;
	}

	get button() {
		return this._button;
	}

	get input() {
		return this._input;
	}

	get activeTags() {
		return this._activeTags;
	}

	/** @param {Array<string>} activeTags */
	set activeTags(activeTags) {
		this._activeTags = new Set(activeTags);
		// this._filterTagCards();
	}

	/** @param {Array<string>} hiddenTags */
	setHiddenTags(hiddenTags) {
		this._hiddenTags = hiddenTags;
		this._filterTagCards();
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

	/**
	 * @param {string} value
	 * @returns {HTMLElement}
	 */
	create(value) {
		const tagActiveListEl = document.querySelector(
			".tag-controls__tag-active-list"
		);

		const tagListActive = new CreateElement()
			.addClasses("tag-menu__collapse__tag-list-active")
			.create("div");

		const tagList = new CreateElement()
			.addClasses("tag-menu__collapse__tag-list")
			.create("div");

		this._forEachTagCards((card, index) => {
			let active = false;

			const cardEl = card.create();
			const tagname = this._tags[index];

			tagList.appendChild(cardEl);

			const closeEl = new CreateElement()
				.addClasses("fa-solid", "fa-circle-xmark", "close", "hidden")
				.create("i");

			const tagActive = new CreateElement()
				.addChildren(tagname, closeEl)
				.addClasses("active-tag")
				.create("p");

			// ----------------------------

			const labelName = new CreateElement()
				.addChildren(tagname)
				.addClasses("active-card__name")
				.create("p");

			const closeLabelBtn = new CreateElement()
				.addClasses("fa-solid", "fa-xmark", "close", "active-card__btn")
				.create("i");

			const label = new CreateElement()
				.addChildren(labelName, closeLabelBtn)
				.addClasses("active-card")
				.create("div");

			closeLabelBtn.addEventListener("mouseenter", () => {
				closeLabelBtn.classList.remove("fa-xmark");
				closeLabelBtn.classList.add("fa-circle-xmark");
			});

			closeLabelBtn.addEventListener("mouseleave", () => {
				closeLabelBtn.classList.add("fa-xmark");
				closeLabelBtn.classList.remove("fa-circle-xmark");
			});

			closeLabelBtn.addEventListener("click", () => {
				if (!active) return;

				this._activeTags.delete(tagname);
				tagActive.remove();
				label.remove();

				this._filterTagCards();

				active = false;

				this._updateActiveTags();
			});

			closeEl.addEventListener("click", () => {
				if (!active) return;

				this._activeTags.delete(tagname);
				tagActive.remove();
				label.remove();

				this._filterTagCards();

				active = false;

				this._updateActiveTags();
			});

			cardEl.addEventListener("click", () => {
				if (active) return;

				this._activeTags.add(tagname);
				tagListActive.appendChild(tagActive);
				tagActiveListEl.appendChild(label);

				this._filterTagCards();

				active = true;

				this._updateActiveTags();
			});
		});

		const searchBar = this._createSearchBar();

		const collapse = new CreateElement()
			.addClasses("tag-menu__collapse")
			.addChildren(searchBar, tagListActive, tagList)
			.create("div");

		const collapseWrapper = new CreateElement()
			.addClasses("tag-menu__collapse-wrapper")
			.addChildren(collapse)
			.create("div");

		const button = this._createButton(value, collapse, searchBar);

		this._tagMenu = new CreateElement()
			.addChildren(button, collapseWrapper)
			.addClasses("tag-menu")
			.create("div");

		return this._tagMenu;
	}
}
