export default class Recipe {
    /**
     * Classe Recipe - The recipe object
     * @class Recipes
     * @param {object} recipe - The JavaScript object of recipe
     * @returns {object} - The current Recipe instance
     */
    constructor(recipe) {
        this.id = recipe.id;
        this.name = recipe.name;
        this.servings = recipe.servings;
        this.ingredients = recipe.ingredients; // array                
        this.time = recipe.time;
        this.description = recipe.description;
        this.appliance = recipe.appliance;
        this.ustensils = recipe.ustensils;
    }
}