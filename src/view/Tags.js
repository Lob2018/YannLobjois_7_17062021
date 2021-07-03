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
    }

    /**
     * Set the tag selected by the user
     * @param {string} tag - The tag's id
     * @param {string} tag - The tag to display
     */
    setTag(id, tag) {
        if (tag === undefined) return;
        switch (id) {
            case "cb-ingredients__listbox":
                this.ingredientsTagsSet.add(tag)
                break;
            case "cb-appareils__listbox":
                this.appareilsTagsSet.add(tag)
                break;
            case "cb-ustensiles__listbox":
                this.ustensilesTagsSet.add(tag)
                break;
        }
        console.log(this.ingredientsTagsSet)
        console.log(this.appareilsTagsSet)
        console.log(this.ustensilesTagsSet)
    }
}