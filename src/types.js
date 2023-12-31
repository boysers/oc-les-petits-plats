"use strict";

/**
 * @typedef {Object} TRecipe
 * @property {number} id
 * @property {string} image
 * @property {string} name
 * @property {number} servings
 * @property {Array<TIngredient>} ingredients
 * @property {number} time
 * @property {string} description
 * @property {string} appliance
 * @property {Array<string>} ustensils
 */

/**
 * @typedef {Object} TIngredient
 * @property {string} ingredient
 * @property {number} [quantity]
 * @property {string} [unit]
 */

/**
 * @typedef {Object} TagList
 * @property {ArrayAdapter<string>} ingredients
 * @property {ArrayAdapter<string>} ustensils
 * @property {ArrayAdapter<string>} appliances
 */

export default {};
