import Recipe from "./Recipe.js";
import Recipes from "../view/Recipes.js";
import recipes from "../../data/recipes.js";


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
        this.recipesArray = [];
        let i = 0;
        while (recipes[i]) {
            this.recipesArray.push(new Recipe(recipes[i]));
            i++;
        }
        this.prepareRecipes();
    }

    filteredRecipes(oldWord) {
        const word = oldWord.toLowerCase().trim();
        this.prepareRecipes(
            this.recipesArray.filter(function(currentElement) {
                return (currentElement.name.toLowerCase().includes(word) ||
                    currentElement.description.toLowerCase().includes(word) ||
                    currentElement.ingredients.findIndex(item => word === item.toString().toLowerCase()) != -1);
            }));
    }

    prepareRecipes(returndRecipesArray) {
        this.noResultsMessage.style.display = 'none';
        this.recipes.clear();
        // Instanciate with all the recipes
        if (returndRecipesArray === undefined) {
            let i = 0;
            while (this.recipesArray[i]) {
                this.recipes.displayRecipe(this.recipesArray[i])
                i++;
            }
            return;
        } else if (returndRecipesArray.length == 0) {
            this.noResultsMessage.style.display = 'flex';
        } else {
            let i = 0;
            while (returndRecipesArray[i]) {
                this.recipes.displayRecipe(returndRecipesArray[i])
                i++;
            }
        }
    }
}