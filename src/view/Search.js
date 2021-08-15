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
     * @memberof Search 
     * @param {object} event - The event of the keyup 
     */
    handleKeyup(event) {
        if (this.search.value.length >= 3) {
            const t0 = performance.now();
            this.allRecipes.filteredRecipes(this.search.value);
            const t1 = performance.now();
            console.log("La méthode filteredRecipes('" + this.search.value + "'), avec l'algorithme #2, a demandé " + (t1 - t0) + " ms")
        } else {
            this.allRecipes.prepareRecipes();
        }
    }

}