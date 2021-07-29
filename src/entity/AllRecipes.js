import Recipe from "./Recipe.js";
import Recipes from "../view/Recipes.js";
import Tags from "../view/Tags.js";
import recipes from "../../data/recipes50.js";


export default class AllRecipes {
    static instance;
    /**
     * Classe AllRecipes - All for the recipe object - Singleton design pattern
     * @class AllRecipes
     * @returns {object} - The current AllRecipes instance
     */
    constructor() {
        if (AllRecipes.instance) {
            return AllRecipes.instance;
        }
        AllRecipes.instance = this;
        this.noResultsMessage = document.getElementsByClassName('no-results')[0];
        this.recipes = new Recipes();
        this.tags = new Tags();
        this.recipesArray = [];
        let i = 0;
        while (recipes[i]) {
            this.recipesArray.push(new Recipe(recipes[i]));
            i++;
        }
        this.prepareRecipes();
    }

    /**
     * The table corresponding to the search
     * @function
     * @memberof AllRecipes
     * @param {string} oldWord - The research
     */
    filteredRecipes(oldWord) {
        const word = oldWord.toLowerCase().trim();
        this.prepareRecipes(
            this.recipesArray.filter(function(currentElement) {
                return (
                    currentElement.name.toLowerCase().includes(word) ||
                    currentElement.description.toLowerCase().includes(word) ||
                    currentElement.ingredients.find(el => {
                        return (el.ingredient + el.unit).toLowerCase().includes(word)
                    }))
            }));
    }

    /**
     * Show the filtered recipes
     * @function
     * @memberof AllRecipes
     * @param {array} returnedRecipesArray 
     * @returns 
     */
    prepareRecipes(returnedRecipesArray) {
        this.noResultsMessage.style.display = 'none';
        this.recipes.clear();
        // Clear HTML list tags
        this.tags.clearTagsListsSets();
        if (returnedRecipesArray === undefined) {
            // with all the recipes (initialize)
            let i = 0;
            while (this.recipesArray[i]) {
                let recipe = this.recipesArray[i];
                this.recipes.displayRecipe(recipe);
                // Add HTML list tag element
                this.tags.updateTagsListSet(recipe);
                i++;
            }
            // Display HTML list of tags
            this.tags.displayTagsList();
            return;
        } else if (returnedRecipesArray.length == 0) {
            // with no results
            this.noResultsMessage.style.display = 'flex';
            // Add HTML list tag element
            this.tags.updateTagsListSet("0");
        } else {
            // with results
            let i = 0;
            while (returnedRecipesArray[i]) {
                let recipe = returnedRecipesArray[i];
                this.recipes.displayRecipe(recipe);
                // Add HTML list tag element
                this.tags.updateTagsListSet(recipe);
                i++;
            }
        }
        // Display HTML list of tags
        this.tags.displayTagsList();
    }
}