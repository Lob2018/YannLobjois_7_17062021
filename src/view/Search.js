import AllRecipes from "../entity/AllRecipes.js";

export default class Search {
    static instance;
    /**
     * Classe Search - Manage the recipes search - Singleton design pattern
     * @class Search
     * @returns {object} - The current Search instance
     */
    constructor() {
        if (Search.instance) {
            return Search.instance;
        }
        Search.instance = this;
        this.search = document.getElementsByClassName("recherche")[0];
        this.search.addEventListener('input', this.handleKeyup.bind(this));
        this.allRecipes = new AllRecipes();
    }

    /**
     * Keyup event
     * @function
     * @memberof ComboBox 
     * @param {object} event - The event of the keyup 
     */
    handleKeyup(event) {
        if (this.search.value.length >= 3) {
            this.allRecipes.filteredRecipes(this.search.value);
        } else {
            this.allRecipes.prepareRecipes();
        }
    }

}