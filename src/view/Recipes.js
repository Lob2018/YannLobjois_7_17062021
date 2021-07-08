export default class Recipes {
    static instance;
    /**
     * Classe Recipes - Display the recipes - Singleton design pattern
     * @class Recipes
     * @returns {object} - The current Recipes instance
     */
    constructor() {
        if (Recipes.instance) {
            return Recipes.instance;
        }
        Recipes.instance = this;
        this.ul = document.getElementsByClassName("recipe-container")[0]
    }

    displayRecipe(recipe) {
        const li = document.createElement('LI');
        li.classList.add("recipe");
        const a = document.createElement('A');
        a.href = '#';
        const article = document.createElement('ARTICLE');
        const image = document.createElement('IMG');
        image.src = './public/photo.png';
        image.setAttribute("alt", recipe.name);
        const section = document.createElement('SECTION');
        const header = document.createElement('HEADER');
        const h2 = document.createElement('H2');
        h2.textContent = recipe.name;
        const p1 = document.createElement('P');
        p1.classList.add("recipe__time");
        const span1 = document.createElement('SPAN');
        span1.classList.add("icon--time");
        const span2 = document.createElement('SPAN');
        span2.classList.add("text--time");
        span2.textContent = recipe.time + " min";
        const p2 = document.createElement('P');
        p2.classList.add("text-ingredients");
        let ingredients = '';
        let i = 0;
        while (recipe.ingredients[i]) {
            const obj = recipe.ingredients[i];
            ingredients += '<b>' + obj.ingredient + ' </b>' + obj.quantity + ' ' + obj.unit + '<br>';
            i++;
        }
        p2.innerHTML = ingredients;
        const p3 = document.createElement('P');
        p3.classList.add("text-description");
        p3.textContent = recipe.description;

        // Add in the DOM
        p1.appendChild(span1)
        p1.appendChild(span2)
        header.appendChild(h2);
        header.appendChild(p1);
        section.appendChild(header);
        section.appendChild(p2);
        section.appendChild(p3);
        article.appendChild(image);
        article.appendChild(section);
        a.appendChild(article);
        li.appendChild(a);
        this.ul.appendChild(li);
    }
}