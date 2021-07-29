export default class Tags {
    static instance;
    /**
     * Classe Tags - The tags selected by the user in the filters - Singleton design pattern
     * @class Tags
     * @returns {object} - The current Tags instance
     */
    constructor() {
        if (Tags.instance) {
            return Tags.instance;
        }
        Tags.instance = this;
        this.ingredientsTagsSet = new Set();
        this.appareilsTagsSet = new Set();
        this.ustensilesTagsSet = new Set();
        // HTML list of tags
        this.ingredientsListTagsSet = new Set();
        this.appareilsListTagsSet = new Set();
        this.ustensilesListTagsSet = new Set();
        // Initialize boolean
        this.initialized = false;
    }

    /**
     * Set the tag selected by the user
     * @function
     * @memberof Tags 
     * @param {string} tag - The id of the instigator
     * @param {string} tag - The tag to display
     */
    setTag(id, tag) {
        if (tag === undefined) return;
        switch (id) {
            case "cb-ingredients__listbox":
                if (this.ingredientsTagsSet.has(tag)) {} else {
                    this.ingredientsTagsSet.add(tag);
                    this.displayTags(0, tag);
                }
                break;
            case "cb-appareils__listbox":
                if (this.appareilsTagsSet.has(tag)) {} else {
                    this.appareilsTagsSet.add(tag);
                    this.displayTags(1, tag);
                }
                break;
            case "cb-ustensiles__listbox":
                if (this.ustensilesTagsSet.has(tag)) {} else {
                    this.ustensilesTagsSet.add(tag);
                    this.displayTags(2, tag);
                }
                break;
        };
        // FILTRER LES RECETTES AVEC TOUS LES TAGS

    }

    /**
     * Display the tag
     * @function
     * @memberof Tags 
     * @param {*} type - The type of tag to add (0=ingredients, 1=appareils, 2=ustensiles)
     * @param {*} tag - The tag's text
     */
    displayTags(type, tag) {
        // UL tags container
        let tagsContainer = document.getElementsByClassName('tags-container')[0];
        if (tagsContainer === undefined) {
            tagsContainer = document.createElement("UL");
            tagsContainer.classList.add("tags-container");
            tagsContainer.setAttribute("role", "menubar");
            tagsContainer.setAttribute("aria-label", "Mots clés");
            // Insert in HTML
            const formElement = document.getElementsByClassName('form-inline')[0];
            const filtresElement = document.getElementsByClassName('filtres')[0];
            formElement.insertBefore(tagsContainer, filtresElement);
        }

        // Create button element
        const tagLink = document.createElement("BUTTON");
        tagLink.setAttribute("role", "menuitem");
        tagLink.setAttribute("name", ("RetireMotCle" + tag.replace(/\s/g, "")));
        tagLink.setAttribute("aria-label", "Retirer le mot-clé " + tag);

        tagLink.tabIndex = 0;
        tagLink.innerHTML = tag;

        const tagList = document.createElement("LI");
        tagList.setAttribute("role", "none");
        tagList.appendChild(tagLink);

        // Add Button class type
        switch (type) {
            case 0:
                tagLink.classList.add("button--ingredients");
                this.tagsListeners(tagLink, 0, tag);
                break;
            case 1:
                tagLink.classList.add("button--appareils");
                this.tagsListeners(tagLink, 1, tag);
                break;
            case 2:
                tagLink.classList.add("button--ustensiles");
                this.tagsListeners(tagLink, 2, tag);
                break;
        }
        // Update HTML content
        tagsContainer.appendChild(tagList);
    }


    /**
     * The tag removal listener
     * @param {object} element - The HTML element listened
     * @param {number} type - The tag type (0 ingredient, 1 appliance, 2 ustensil)
     * @param {string} value - The tag's value
     */
    tagsListeners(element, type, value) {
        // Remove on click
        element.addEventListener('click', (event) => {
            this.removeTagInSet(type, value);
            element.parentElement.remove();
            return false;
        });
        // Remove on keyup
        element.addEventListener("keyup", function(event) {
            if (event.key === 'Enter') {
                this.removeTagInSet(type, value);
                element.parentElement.remove();
                return false;
            }
        });
        // FILTRER LES RECETTES AVEC TOUS LES TAGS

    }

    /**
     * Remove the tag form the corresponding Set
     * @function
     * @memberof Tags 
     * @param {number} type - The tag's type
     * @param {string} value - The tag's text to remove
     */
    removeTagInSet(type, value) {
        switch (type) {
            case 0:
                this.ingredientsTagsSet.delete(value);
                this.removeTagsContainer();
                break;
            case 1:
                this.appareilsTagsSet.delete(value);
                this.removeTagsContainer();
                break;
            case 2:
                this.ustensilesTagsSet.delete(value);
                this.removeTagsContainer();
                break;
        }
    }

    /**
     * Remove the tags DOM container if needed
     * @function
     * @memberof Tags 
     */
    removeTagsContainer() {
        const tagsContainer = document.getElementsByClassName('tags-container')[0]
        if (tagsContainer.getElementsByTagName("li").length == 1) tagsContainer.remove();
    }



    /**
     * Clear the tags lists sets, and hide the tag's HTML li elements
     * @function
     * @memberof Tags 
     */
    clearTagsListsSets() {
        // clear the lists tags sets
        this.ingredientsListTagsSet.clear();
        this.appareilsListTagsSet.clear();
        this.ustensilesListTagsSet.clear();

        // disable all lists tags
        const ingredients = document.getElementById("cb-ingredients__listbox").getElementsByTagName("LI");
        for (let ingredient of ingredients) {
            ingredient.style.display = 'none';
        }
        const appareils = document.getElementById("cb-appareils__listbox").getElementsByTagName("LI");
        for (let appareil of appareils) {
            appareil.style.display = 'none';
        }
        const ustensiles = document.getElementById("cb-ustensiles__listbox").getElementsByTagName("LI");
        for (let ustensile of ustensiles) {
            ustensile.style.display = 'none';
        }
    }

    /**
     * Add to a tag lists set
     * @function
     * @memberof Tags 
     * @param {object} recipe - The added recipe
     */
    updateTagsListSet(recipe) {
        if (recipe == "0") {
            this.clearTagsListsSets();
        } else {
            //set of ingredients, ustensils, appliance
            if (recipe.appliance) this.appareilsListTagsSet.add(recipe.appliance);
            if (recipe.ingredients != undefined) {
                for (let ingredient of recipe.ingredients) {
                    this.ingredientsListTagsSet.add(ingredient.ingredient);
                }
            }
            if (recipe.ustensils != undefined) {
                for (let ustensil of recipe.ustensils) {
                    this.ustensilesListTagsSet.add(ustensil);
                }
            }
        }
    }


    /**
     * Display the tags in the ULs elements
     * @function
     * @memberof Tags 
     */
    displayTagsList() {
        const ingredients = document.getElementById("cb-ingredients__listbox")
        const appareils = document.getElementById("cb-appareils__listbox")
        const ustensiles = document.getElementById("cb-ustensiles__listbox")
        for (let item of this.ingredientsListTagsSet) {
            if (this.initialized) {
                document.getElementById("lb1-" + item.replace(/[^a-zA-Z]/g, "")).style.display = 'block';
            } else {
                this.createLiElement(ingredients, item, "lb1-");
            }
        }
        for (let item of this.appareilsListTagsSet) {
            if (this.initialized) {
                document.getElementById("lb2-" + item.replace(/[^a-zA-Z]/g, "")).style.display = 'block';
            } else {
                this.createLiElement(appareils, item, "lb2-");
            }
        }
        for (let item of this.ustensilesListTagsSet) {
            if (this.initialized) {
                document.getElementById("lb3-" + item.replace(/[^a-zA-Z]/g, "")).style.display = 'block';
            } else {
                this.createLiElement(ustensiles, item, "lb3-");
            }
        }

        this.initialized = true;
    }


    /**
     * Create and add the li tag element
     * @param {object} container - The DOM UL element
     * @param {*} txt - The tag's text
     * @param {*} idPrefix - The tag id's prefixe
     */
    createLiElement(container, txt, idPrefix) {
        const element = document.createElement("LI");
        element.appendChild(document.createTextNode(txt));
        element.setAttribute("role", "option");
        // Remove anything that is not a letter
        element.id = idPrefix + txt.replace(/[^a-zA-Z]/g, "");
        container.appendChild(element);
    }

}