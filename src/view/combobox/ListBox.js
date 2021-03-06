import ListBoxOption from './ListBoxOption';

export default class ListBox {
    /**
     * Classe ListBox - Manages the list box 
     * @class ListBox
     * @param {object} domNode - 
     * @param {object} comboboxObj - 
     */
    constructor(domNode, comboboxObj) {
        // const elementChildren;
        const msgPrefix = 'Listbox constructor argument domNode ';
        // Check whether domNode is a DOM element
        if (!(domNode instanceof Element)) {
            throw new TypeError(msgPrefix + 'is not a DOM Element.');
        }
        // Check whether domNode has child elements
        if (domNode.childElementCount === 0) {
            throw new Error(msgPrefix + 'has no element children.');
        }
        // Check whether domNode child elements are A elements
        let childElement = domNode.firstElementChild;
        while (childElement) {
            childElement = childElement.nextElementSibling;
        }
        this.domNode = domNode;
        this.combobox = comboboxObj;
        this.allOptions = [];
        this.options = []; // see PopupMenu init method
        this.firstOption = null; // see PopupMenu init method
        this.lastOption = null; // see PopupMenu init method
        this.hasFocus = false; // see MenuItem handleFocus, handleBlur
        this.hasHover = false; // see PopupMenu handleMouseover, handleMouseout
    }

    /**
     * Initialize ListBox
     * @function
     * @memberof ListBox  
     */
    init() {
        let optionElement, optionElements, option;
        // const childElement;
        // const firstChildElement;
        // const textContent;
        // const numItems;
        // Configure the domNode itself
        this.domNode.tabIndex = -1;
        this.domNode.setAttribute('role', 'listbox');
        this.domNode.addEventListener('mouseover', this.handleMouseover.bind(this));
        // Traverse the element children of domNode: configure each with
        // option role behavior and store reference in.options array.
        optionElements = this.domNode.getElementsByTagName('LI');
        for (let i = 0; i < optionElements.length; i++) {
            optionElement = optionElements[i];
            if (!optionElement.firstElementChild && optionElement.getAttribute('role') != 'separator') {
                option = new ListBoxOption(optionElement, this);
                option.init();
                this.allOptions.push(option);
            }
        }
        this.filterOptions('');
    }

    /**
     * Set the filter options
     * @function
     * @memberof ListBox 
     * @param {string} filter - The filter text
     * @param {object} currentOption - The filter DOM element
     * @returns {(object|boolean)} - The current option or false
     */
    filterOptions(filter, currentOption) {
        if (typeof filter !== 'string') {
            filter = '';
        }
        let option, textContent;
        filter = filter.toLowerCase();
        this.options = [];
        this.firstChars = [];
        this.domNode.innerHTML = '';
        for (let i = 0; i < this.allOptions.length; i++) {
            option = this.allOptions[i];
            if (filter.length === 0 || option.textComparison.indexOf(filter) === 0) {
                this.options.push(option);
                textContent = option.textContent.trim();
                this.firstChars.push(textContent.substring(0, 1).toLowerCase());
                this.domNode.appendChild(option.domNode);
            }
        }
        // Use populated.options array to initialize firstOption and lastOption.
        const numItems = this.options.length;
        if (numItems > 0) {
            this.firstOption = this.options[0];
            this.lastOption = this.options[numItems - 1];

            if (currentOption && this.options.indexOf(currentOption) >= 0) {
                option = currentOption;
            } else {
                option = this.firstOption;
            }
        } else {
            this.firstOption = false;
            option = false;
            this.lastOption = false;
        }
        return option;
    }

    /**
     * Set the aria-selected value for this option
     * @function
     * @memberof ListBox 
     * @param {object} option - The selected DOM option element
     */
    setCurrentOptionStyle(option) {
        for (let i = 0; i < this.options.length; i++) {
            const opt = this.options[i];
            if (opt === option) {
                opt.domNode.setAttribute('aria-selected', 'true');
                this.domNode.scrollTop = opt.domNode.offsetTop;
            } else {
                opt.domNode.removeAttribute('aria-selected');
            }
        }
    }

    /**
     * Set the option in the combobox
     * @function
     * @memberof ListBox 
     * @param {object} option - The selected DOM option element
     */
    setOption(option) {
        if (option) {
            this.combobox.setOption(option);
            this.combobox.setValue(option.textContent);
        }
    }

    /**
     * Mouseover event
     * @function
     * @memberof ListBox 
     */
    handleMouseover() {
        this.hasHover = true;
    }

    /**
     * Focus management for the first option
     * @function
     * @memberof ListBox 
     * @returns {object} - The first option DOM element
     */
    getFirstItem() {
        return this.firstOption;
    }

    /**
     * Focus management for the last option
     * @function
     * @memberof ListBox 
     * @returns {object} - The last option DOM element
     */
    getLastItem() {
        return this.lastOption;
    }

    /**
     * Focus management for the previous option
     * @function
     * @memberof ListBox 
     * @returns {object} - The previous option DOM element
     */
    getPreviousItem(currentOption) {
        let index = this.options.indexOf(currentOption) - 1;
        let cpt = 0;
        while (!this.optionIsVisible(this.options[index])) {
            cpt++;
            index--;
            if (index <= 0) index = this.options.length - 1;
            // stop condition for one option
            if (cpt == this.options.length) {
                return this.options[this.options.indexOf(currentOption)];
            }
        }
        return this.options[index];
    }

    /**
     * Focus management for the next option
     * @function
     * @memberof ListBox 
     * @returns {object} - The next option DOM element
     */
    getNextItem(currentOption) {
        let index = this.options.indexOf(currentOption) + 1;
        let cpt = 0;
        while (!this.optionIsVisible(this.options[index])) {
            cpt++;
            index++;
            if (index > this.options.length - 1) index = 0;
            // stop condition for one option
            if (cpt == this.options.length) {
                return this.options[this.options.indexOf(currentOption)];
            }
        }
        return this.options[index];
    }

    /**
     * Know if the option is visible
     * @function
     * @memberof ListBox 
     * @param {object} option - The option DOM element
     * @returns {boolean} - Is the option visible (yes=true, no=false)
     */
    optionIsVisible(option) {
        if (option === undefined) return false;
        if (option.domNode.style.display == 'none') {
            return false;
        } else return true;
    }


    /* MENU DISPLAY METHODS */

    /**
     * Menu display is opened ?
     * @function
     * @memberof ListBox 
     * @returns {boolean} - True if it's diplayed
     */
    isOpen() {
        return this.domNode.style.display === 'flex';
    }

    /**
     * Menu display is closed ?
     * @function
     * @memberof ListBox 
     * @returns {boolean} - False if it's diplayed
     */
    isClosed() {
        return this.domNode.style.display !== 'flex';
    }

    /**
     * Menu display has options ?
     * @function
     * @memberof ListBox 
     * @returns {boolean} - True if it has options
     */
    hasOptions() {
        return this.options.length;
    }

    /**
     * Display the menu
     * @function
     * @memberof ListBox 
     */
    open() {
        // set CSS properties
        this.domNode.style.display = 'flex';
        // set aria-expanded attribute
        this.combobox.domNode.setAttribute('aria-expanded', 'true');
    }

    /**
     * Close the menu
     * @function
     * @memberof ListBox 
     * @param {boolean} force - True if needs to force the close command
     */
    close(force) {
        if (typeof force !== 'boolean') {
            force = false;
        }

        if (force || (!this.hasFocus && !this.hasHover && !this.combobox.hasHover)) {
            this.setCurrentOptionStyle(false);
            this.domNode.style.display = 'none';
            this.combobox.domNode.setAttribute('aria-expanded', 'false');
            this.combobox.setActiveDescendant(false);
        }
    }

    /**
     * Clear the combobox value
     * @function
     * @memberof ListBox 
     */
    clearComboBoxValue() {
        this.combobox.setValue('');
    }


}