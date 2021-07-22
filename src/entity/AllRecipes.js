import Recipe from "./Recipe.js";
import Recipes from "../view/Recipes.js";
import recipes from "../../data/recipes5000.js";


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

            this.recipesArray.filter(recette => {
                const sentence = (recette.name + recette.description +
                    recette.ingredients.map(function(ingredient) {
                        return ingredient.ingredient + ingredient.unit
                    })).toLowerCase();
                // Dichotomy on sentence
                const wordsArray = [];
                const firstChar = word[0];
                let index;
                let startIndex = 0;
                while ((index = sentence.indexOf(firstChar, startIndex)) > -1) {
                    wordsArray.push(sentence.substring(index, index + word.length));
                    startIndex = index + 1;
                }
                if (this.sentenceDichotomy(wordsArray.sort(), word, 0, wordsArray.length)) {
                    return recette;
                }
            })

        );
    }

    sentenceDichotomy(wordsArray, word, start, end) {
        if (start > end) {
            return false
        }
        let middle = Math.floor((start + end) / 2);
        if (wordsArray[middle] == word) {
            return true;
        }
        if (word < wordsArray[middle]) {
            return this.sentenceDichotomy(wordsArray, word, start, middle - 1)
        } else {
            return this.sentenceDichotomy(wordsArray, word, middle + 1, end)
        }
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