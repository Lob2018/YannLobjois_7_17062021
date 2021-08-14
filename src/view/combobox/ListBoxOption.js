import Tags from '../Tags';

export default class ListBoxOption {
    /**
     * Classe ListBoxOption - Manages the list box options
     * @class ListBoxOption
     * @param {*} domNode 
     * @param {*} listboxObj 
     */
    constructor(domNode, listboxObj) {
        this.domNode = domNode;
        this.listbox = listboxObj;
        this.textContent = domNode.textContent;
        this.textComparison = domNode.textContent.toLowerCase();
        // The Tags object
        this.tags = new Tags();
    }

    /**
     * Initialize ListBoxOption
     * @function
     * @memberof ListBoxOption  
     */
    init() {
        if (!this.domNode.getAttribute('role')) {
            this.domNode.setAttribute('role', 'option');
        }
        this.domNode.addEventListener('click', this.handleClick.bind(this));
        this.domNode.addEventListener('mouseover', this.handleMouseover.bind(this));
    }

    /**
     * Click event
     * @function
     * @memberof ListBoxOption 
     */
    handleClick() {
        // Clear the combobox value to get all the tags in the list
        this.listbox.clearComboBoxValue();
        // Set the selected tag
        this.tags.setTag(this.domNode.parentElement.id, this.textContent);
        this.listbox.setOption(this);
        this.listbox.close(true);
        document.getElementById("cb-ingredients__input").value = "";
        document.getElementById("cb-appareils__input").value = "";
        document.getElementById("cb-ustensiles__input").value = "";
    }

    /**
     * Mouseover event
     * @function
     * @memberof ListBoxOption 
     */
    handleMouseover() {
        this.listbox.hasHover = true;
        this.listbox.open();
    }
}