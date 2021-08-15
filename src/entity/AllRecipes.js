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
        // Pass if needed
        if (oldWord.length < 3) {
            this.prepareRecipes(undefined);
            return;
        }
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



    prepareRecipes(returnedRecipesArray) {
        this.noResultsMessage.style.display = 'none';
        this.recipes.clear();
        // Clear HTML list tags        
        this.tags.clearTagsListsSets();

        if (returnedRecipesArray === undefined) {
            // with all the recipes (initialize)
            returnedRecipesArray = this.recipesArray;
            //// FILTER BY TAGS
            returnedRecipesArray = this.recipesResultFilteredByTags(returnedRecipesArray)
            let i = 0;
            while (returnedRecipesArray[i]) {
                let recipe = returnedRecipesArray[i];
                this.displayTheRecipe(recipe)
                i++;
            }
            // Display HTML list of tags, then leave the function
            this.tags.displayTagsList();
            return;
        } else if (returnedRecipesArray.length == 0) {
            // with no results
            this.noResultsMessage.style.display = 'flex';
            // Add HTML list tag element
            this.tags.updateTagsListSet("0");
        } else {
            // with results 
            //// FILTER BY TAGS
            returnedRecipesArray = this.recipesResultFilteredByTags(returnedRecipesArray)
            let i = 0;
            // if empty show the message
            if (returnedRecipesArray.length == 0) this.noResultsMessage.style.display = 'flex';
            while (returnedRecipesArray[i]) {
                let recipe = returnedRecipesArray[i];
                this.displayTheRecipe(recipe)
                i++;
            }
        }
        // Display HTML list of tags
        this.tags.displayTagsList();
    }


    /**
     * Show or not the recipe according to the current tags
     * @function
     * @memberof AllRecipes
     * @param {object} returnedRecipesArray - The recipe
     * @returns {array} - Return the array filtered by tags
     */
    recipesResultFilteredByTags(returnedRecipesArray) {
        const selectedTags = this.tags.getSelectedTags();
        const ingredientsTags = selectedTags.ingredients;
        const appareilsTags = selectedTags.appareils;
        const ustensilesTags = selectedTags.ustensiles;
        return returnedRecipesArray.filter(currentElement => {
            return (
                this.applianceTags(currentElement.appliance, appareilsTags) &&
                this.ustensilsTags(currentElement.ustensils, ustensilesTags) &&
                this.ingredientsTags(currentElement.ingredients, ingredientsTags)
            )
        });
    }

    /**
     * Show or not the recipe according to the current appliances tags
     * @function
     * @memberof AllRecipes
     * @param {object} appliance - The recipe appliance object
     * @param {object} appareilsTags 
     * @returns {boolean} - True if it's tagged, otherwise false
     */
    applianceTags(appliance, appareilsTags) {
        let cpt = 0;
        if (appareilsTags.size != 0) {
            for (let appareilTag of appareilsTags) {
                if (appliance.toLowerCase() == appareilTag.toLowerCase()) {
                    cpt++;
                }
            }
        } else return true;
        return (cpt == appareilsTags.size ? true : false);
    }

    /**
     * Show or not the recipe according to the current ustensils tags
     * @function
     * @memberof AllRecipes
     * @param {object} ustensils 
     * @param {object} ustensilesTags 
     * @returns {boolean} - True if it's tagged, otherwise false 
     */
    ustensilsTags(ustensils, ustensilesTags) {
        let cpt = 0;
        if (ustensilesTags.size != 0) {
            for (let ustensileTag of ustensilesTags) {
                const index = ustensils.findIndex(item => ustensileTag.toLowerCase() === item.toLowerCase());
                if (index != -1) cpt++;
            }
        } else return true;
        return (cpt == ustensilesTags.size ? true : false);

    }

    /**
     * Show or not the recipe according to the current ingredients tags
     * @function
     * @memberof AllRecipes
     * @param {object} ingredients 
     * @param {object} ingredientsTags 
     * @returns {boolean} - True if it's tagged, otherwise false 
     */
    ingredientsTags(ingredients, ingredientsTags) {
        let cpt = 0;
        if (ingredientsTags.size != 0) {
            for (let ingredientTag of ingredientsTags) {
                if (ingredients.find(el => el.ingredient.toLowerCase() === ingredientTag.toLowerCase()))
                    cpt++;
            }
        } else return true;
        return (cpt == ingredientsTags.size ? true : false);
    }

    /**
     * Display the recipe
     * @function
     * @memberof AllRecipes
     * @param {object} recipe - The recipe to display
     */
    displayTheRecipe(recipe) {
        this.recipes.displayRecipe(recipe);
        // Add HTML list tag element
        this.tags.updateTagsListSet(recipe);
    }

}