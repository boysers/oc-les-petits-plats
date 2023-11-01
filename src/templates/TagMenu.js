"use strict";

import { ArrayAdapter } from "../adapter";
import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";
import { cleanAndNormalizeString } from "../utils/normalizeString";
import { CreateElement } from "./CreateElement";
import { SearchBar } from "./SearchBar";
import { TagCard } from "./TagCard";

export class TagMenu {
	/** @type {HTMLElement | undefined} */
	#tagMenu;

	#keyword;

	#tags;

	/** @type {ArrayAdapter<string>} */
	#hiddenTags;

	/** @type {HTMLElement} */
	#button;

	#tagCards;

	/** @type {Set<string>} */
	#activeTags;

	#eventActiveTags;

	/** @type {HTMLInputElement | undefined} */
	#input;

	/** @type {HTMLElement} */
	#tagActiveListWrapper;

	/**
	 * @param {ArrayAdapter<string>} tags
	 */
	constructor(tags) {
		this.#keyword = "";

		this.#tags = new ArrayAdapter(...tags);

		this.#hiddenTags = new ArrayAdapter(...tags);

		this.#tagCards = this.#tags.map((tag) => new TagCard(tag));

		this.#activeTags = new Set();

		this.#eventActiveTags = new CustomEvent("active-tags", {
			detail: { tags: new ArrayAdapter(...this.#activeTags) },
		});

		this.#tagActiveListWrapper = document.querySelector(
			".tag-controls__tag-active-list"
		);
	}

	#filterTagCards() {
		const uniqueTags = new Set(this.#hiddenTags);

		this.#tags.forEach((tag, index) => {
			const shouldHide =
				!tag.includes(this.#keyword) ||
				this.#activeTags.has(tag) ||
				!uniqueTags.has(tag);

			this.#tagCards[index].setHidden(shouldHide);
		});
	}

	#updateActiveTags() {
		this.#eventActiveTags.detail.tags = new ArrayAdapter(
			...this.#activeTags
		);
		this.#tagMenu.dispatchEvent(this.#eventActiveTags);
	}

	#createSearchBar() {
		const searchBar = new SearchBar();

		searchBar.addEventListener("input", (e) => {
			const isTarget = e.target instanceof HTMLInputElement;
			if (!isTarget) return;

			const value = e.target.value;

			this.#keyword = cleanAndNormalizeString(value.toLowerCase());

			this.#filterTagCards();
		});

		return searchBar.create();
	}

	/**
	 * @param {string} name
	 * @param {HTMLElement} collapseEl
	 * @param {HTMLElement} searchBarEl
	 * @returns {HTMLElement}
	 */
	#createButton(name, collapseEl, searchBarEl) {
		this.#input = searchBarEl.querySelector("input");

		let isOpen = false;

		const nameEl = new CreateElement().addChildren(name).create("p");

		const chevronEl = new CreateElement()
			.addClasses("fa-solid", "fa-chevron-down")
			.create("i");

		const button = new CreateElement()
			.addChildren(nameEl, chevronEl)
			.addClasses("tag-menu__button")
			.create("div");

		const handleClickButton = () => {
			if (isOpen) {
				isOpen = false;

				chevronEl.classList.remove("fa-chevron-up");
				chevronEl.classList.add("fa-chevron-down");

				collapseEl.classList.remove("tag-menu__collapse--open");

				this.#tagMenu.classList.remove("open");

				if (this.#input) {
					this.#input.value = "";
				}

				this.#keyword = "";
				this.#filterTagCards();
				return;
			}
			isOpen = true;

			this.#tagMenu?.classList.add("open");

			chevronEl.classList.add("fa-chevron-up");
			chevronEl.classList.remove("fa-chevron-down");

			collapseEl.classList.add("tag-menu__collapse--open");

			this.#input?.focus();
		};

		button.addEventListener("close", () => {
			if (isOpen) handleClickButton();
		});

		button.addEventListener("click", handleClickButton);

		return button;
	}

	/**
	 * @param {TagCard} card
	 * @param {number} index
	 * @param {HTMLDivElement} tagList
	 * @param {HTMLDivElement} tagListActive
	 * @returns {void}
	 */
	#initTagCardEvent(card, index, tagList, tagListActive) {
		let active = false;

		const cardEl = card.create();
		const tagname = this.#tags[index];

		tagList.appendChild(cardEl);

		const closeEl = new CreateElement()
			.addClasses("fa-solid", "fa-circle-xmark", "close", "hidden")
			.create("i");

		const tagActive = new CreateElement()
			.addChildren(capitalizeFirstLetter(tagname), closeEl)
			.addClasses("active-tag")
			.create("p");

		// ----------------------------

		const labelName = new CreateElement()
			.addChildren(capitalizeFirstLetter(tagname))
			.addClasses("active-card__name")
			.create("p");

		const labelCloseBtn = new CreateElement()
			.addClasses("fa-solid", "fa-xmark", "close", "active-card__btn")
			.create("i");

		const label = new CreateElement()
			.addChildren(labelName, labelCloseBtn)
			.addClasses("active-card")
			.create("div");

		labelCloseBtn.addEventListener("mouseenter", () => {
			labelCloseBtn.classList.remove("fa-xmark");
			labelCloseBtn.classList.add("fa-circle-xmark");
		});

		labelCloseBtn.addEventListener("mouseleave", () => {
			labelCloseBtn.classList.add("fa-xmark");
			labelCloseBtn.classList.remove("fa-circle-xmark");
		});

		labelCloseBtn.addEventListener("click", () => {
			if (!active) return;

			this.#activeTags.delete(tagname);
			tagActive.remove();
			label.remove();

			this.#filterTagCards();

			active = false;

			this.#updateActiveTags();
		});

		closeEl.addEventListener("click", () => {
			if (!active) return;

			this.#activeTags.delete(tagname);
			tagActive.remove();
			label.remove();

			this.#filterTagCards();

			active = false;

			this.#updateActiveTags();
		});

		cardEl.addEventListener("click", () => {
			if (active) return;

			this.#activeTags.add(tagname);
			tagListActive.appendChild(tagActive);
			this.#tagActiveListWrapper.appendChild(label);

			this.#filterTagCards();

			active = true;

			this.#updateActiveTags();
		});
	}

	get button() {
		return this.#button;
	}

	get input() {
		return this.#input;
	}

	get activeTags() {
		return this.#activeTags;
	}

	/** @param {ArrayAdapter<string>} activeTags */
	set activeTags(activeTags) {
		this.#activeTags = new Set(activeTags);
	}

	/** @param {ArrayAdapter<string>} hiddenTags */
	setHiddenTags(hiddenTags) {
		this.#hiddenTags = hiddenTags;
		this.#filterTagCards();
	}

	/**
	 * @param {string} name
	 * @returns {HTMLElement}
	 */
	create(name) {
		const tagListActive = new CreateElement()
			.addClasses("tag-menu__collapse__tag-list-active")
			.create("div");

		const tagList = new CreateElement()
			.addClasses("tag-menu__collapse__tag-list")
			.create("div");

		this.#tagCards.forEach((card, index) =>
			this.#initTagCardEvent(card, index, tagList, tagListActive)
		);

		const searchBar = this.#createSearchBar();

		const collapse = new CreateElement()
			.addClasses("tag-menu__collapse")
			.addChildren(searchBar, tagListActive, tagList)
			.create("div");

		const collapseWrapper = new CreateElement()
			.addClasses("tag-menu__collapse-wrapper")
			.addChildren(collapse)
			.create("div");

		this.#button = this.#createButton(name, collapse, searchBar);

		this.#tagMenu = new CreateElement()
			.addChildren(this.#button, collapseWrapper)
			.addClasses("tag-menu")
			.create("div");

		return this.#tagMenu;
	}
}
