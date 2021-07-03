import ListBox from './ListBox';
import Tags from '../Tags';

export default class ComboBox {

    /**
     * Classe ComboBox - Manages filter comboboxes 
     * @class ComboBox
     * @param {*} domNode 
     */
    constructor(domNode) {
        this.domNode = domNode;
        this.listbox = false;
        this.option = false;
        this.hasFocus = false;
        this.hasHover = false;
        this.filter = '';
        this.isNone = false;
        this.isList = false;
        this.isBoth = false;
        this.keyCode = Object.freeze({
            'BACKSPACE': 8,
            'TAB': 9,
            'RETURN': 13,
            'ESC': 27,
            'SPACE': 32,
            'PAGEUP': 33,
            'PAGEDOWN': 34,
            'END': 35,
            'HOME': 36,
            'LEFT': 37,
            'UP': 38,
            'RIGHT': 39,
            'DOWN': 40
        });
        window.addEventListener('load', function() {
            const comboboxes = document.querySelectorAll('.combobox-list [role="combobox"]');
            for (let i = 0; i < comboboxes.length; i++) {
                const combobox = new ComboBox(comboboxes[i]);
                combobox.init();
            }
        });
        // The Tags object
        this.tags = new Tags();
    };

    /**
     * Initialize ComboBox
     * @function
     * @memberof ComboBox  
     */
    init() {
        this.domNode.setAttribute('aria-haspopup', 'listbox');
        let autocomplete = this.domNode.getAttribute('aria-autocomplete');
        if (typeof autocomplete === 'string') {
            autocomplete = autocomplete.toLowerCase();
            this.isNone = autocomplete === 'none';
            this.isList = autocomplete === 'list';
            this.isBoth = autocomplete === 'both';
        } else {
            // default value of autocomplete
            this.isNone = true;
        }
        this.domNode.addEventListener('keydown', this.handleKeydown.bind(this));
        this.domNode.addEventListener('keyup', this.handleKeyup.bind(this));
        this.domNode.addEventListener('touchend', this.handleKeyup.bind(this));
        this.domNode.addEventListener('click', this.handleClick.bind(this));
        this.domNode.addEventListener('focus', this.handleFocus.bind(this));
        this.domNode.addEventListener('blur', this.handleBlur.bind(this));
        // initialize pop up menus
        const listbox = document.getElementById(this.domNode.getAttribute('aria-controls'));
        if (listbox) {
            this.listbox = new ListBox(listbox, this);
            this.listbox.init();
        }
        // Open Button
        const button = this.domNode.nextElementSibling;
        if (button && button.tagName === 'SPAN') {
            button.addEventListener('click', this.handleButtonClick.bind(this));
            button.addEventListener('keyup', this.handleButtonKeyUp.bind(this));
        }
    };

    /**
     * Set the aria-activedescendant attribute (by id)
     * @function
     * @memberof ComboBox  
     * @param {object} option - The active option element
     */
    setActiveDescendant(option) {
        if (option && this.listbox.hasFocus) {
            this.domNode.setAttribute('aria-activedescendant', option.domNode.id);
        } else {
            this.domNode.setAttribute('aria-activedescendant', '');
        }
    };

    /**
     * Set the value selected
     * @function
     * @memberof ComboBox  
     * @param {string} value - The value selected
     */
    setValue(value) {
        this.filter = value;
        this.domNode.value = this.filter;
        this.domNode.setSelectionRange(this.filter.length, this.filter.length);
        if (this.isList || this.isBoth) {
            this.listbox.filterOptions(this.filter, this.option);
        }
    };


    /**
     * Set the value selected
     * @function
     * @memberof ComboBox 
     * @param {object} option - The focused LI DOM element 
     * @param {boolean} flag - True when moving between the options (with the stop propagation)
     */
    setOption(option, flag) {
        if (typeof flag !== 'boolean') {
            flag = false;
        }
        if (option) {
            this.option = option;
            this.listbox.setCurrentOptionStyle(this.option);
            this.setActiveDescendant(this.option);

            if (this.isBoth) {
                this.domNode.value = this.option.textContent;
                if (flag) {
                    this.domNode.setSelectionRange(this.option.textContent.length, this.option.textContent.length);
                } else {
                    this.domNode.setSelectionRange(this.filter.length, this.option.textContent.length);
                }
            }
        }
    };

    /**
     * Set the focus on the combobox group
     * @function
     * @memberof ComboBox 
     */
    setVisualFocusTextbox() {
        this.listbox.domNode.classList.remove('focus');
        this.listbox.hasFocus = false;
        this.domNode.parentNode.classList.add('focus'); // set the focus class to the parent for easier styling
        this.hasFocus = true;
        this.setActiveDescendant(false);
    };

    /**
     * Set the focus on the Listbox
     * @function
     * @memberof ComboBox 
     */
    setVisualFocusListbox() {
        this.domNode.parentNode.classList.remove('focus');
        this.hasFocus = false;
        this.listbox.domNode.classList.add('focus');
        this.listbox.hasFocus = true;
        this.setActiveDescendant(this.option);

    };

    /**
     * Remove the focus of the combobox
     * @function
     * @memberof ComboBox 
     */
    removeVisualFocusAll() {
        this.domNode.parentNode.classList.remove('focus');
        this.hasFocus = false;
        this.listbox.domNode.classList.remove('focus');
        this.listbox.hasFocus = false;
        this.option = false;
        this.setActiveDescendant(false);
    };

    /**
     * Keydown event
     * @function
     * @memberof ComboBox 
     * @param {object} event - The event of the keydown 
     */
    handleKeydown(event) {
        const tgt = event.currentTarget;
        let flag = false;
        const char = event.key;
        const shiftKey = event.shiftKey;
        const ctrlKey = event.ctrlKey;
        const altKey = event.altKey;
        switch (event.keyCode) {
            case this.keyCode.RETURN:
                if ((this.listbox.hasFocus || this.isBoth) && this.option) {
                    this.setValue(this.option.textContent);
                }
                this.listbox.close(true);
                flag = true;
                this.toogleFilters();
                // Set the selected tag
                this.tags.setTag(this.listbox.domNode.id, this.option.textContent);
                this.removeVisualFocusAll();
                this.filter = '';
                this.setValue('');
                this.domNode.blur();
                break;
            case this.keyCode.DOWN:
                if (this.listbox.hasOptions()) {
                    if (this.listbox.hasFocus || (this.isBoth && this.option)) {
                        this.setOption(this.listbox.getNextItem(this.option), true);
                    } else {
                        this.listbox.open();
                        if (!altKey) {
                            this.setOption(this.listbox.getFirstItem(), true);
                        }
                    }
                    this.setVisualFocusListbox();
                }
                flag = true;
                break;
            case this.keyCode.UP:
                if (this.listbox.hasOptions()) {
                    if (this.listbox.hasFocus || (this.isBoth && this.option)) {
                        this.setOption(this.listbox.getPreviousItem(this.option), true);
                    } else {
                        this.listbox.open();
                        if (!altKey) {
                            this.setOption(this.listbox.getLastItem(), true);
                        }
                    }
                    this.setVisualFocusListbox();
                }
                flag = true;
                break;
            case this.keyCode.ESC:
                this.removeVisualFocusAll();
                this.filter = '';
                this.setValue('');
                this.domNode.blur();
                this.toogleFilters();
                break;
            case this.keyCode.TAB:
                this.listbox.close(true);
                if (this.listbox.hasFocus) {
                    if (this.option) {
                        this.setValue(this.option.textContent);
                    }
                }
                break;
            default:
                break;
        }
        if (flag) {
            event.stopPropagation();
            event.preventDefault();
        }
    };

    /**
     * Keyup event
     * @function
     * @memberof ComboBox 
     * @param {object} event - The event of the keyup 
     */
    handleKeyup(event) {
        let flag = false;
        let option = false;
        const char = event.key;

        function isPrintableCharacter(str) {
            if (str === undefined) { // remove autocomplete selection error
                return 1;
            } else return str.length === 1 && str.match(/\S/);
        }
        if (isPrintableCharacter(char)) {
            this.filter += char;
        }
        // this is for the case when a selection in the textbox has been deleted
        if (this.domNode.value.length < this.filter.length) {
            this.filter = this.domNode.value;
            this.option = false;
        }
        if (event.keyCode === this.keyCode.ESC) {
            return;
        }
        switch (event.keyCode) {
            case this.keyCode.BACKSPACE:
                this.setValue(this.domNode.value);
                this.setVisualFocusTextbox();
                this.listbox.setCurrentOptionStyle(false);
                this.option = false;
                flag = true;
                break;
            case this.keyCode.LEFT:
            case this.keyCode.RIGHT:
            case this.keyCode.HOME:
            case this.keyCode.END:
                if (this.isBoth) {
                    this.filter = this.domNode.value;
                } else {
                    this.option = false;
                    this.listbox.setCurrentOptionStyle(false);
                }
                this.setVisualFocusTextbox();
                flag = true;
                break;
            default:
                if (isPrintableCharacter(char)) {
                    this.setVisualFocusTextbox();
                    this.listbox.setCurrentOptionStyle(false);
                    flag = true;
                    if (this.isList || this.isBoth) {
                        option = this.listbox.filterOptions(this.filter, this.option);
                        if (option) {
                            if (this.listbox.isClosed() && this.domNode.value.length) {
                                this.listbox.open();
                            }

                            if (option.textComparison.indexOf(this.domNode.value.toLowerCase()) === 0) {
                                this.option = option;
                                if (this.isBoth || this.listbox.hasFocus) {
                                    this.listbox.setCurrentOptionStyle(option);
                                    if (this.isBoth && isPrintableCharacter(char)) {
                                        this.setOption(option);
                                    }
                                }
                            } else {
                                this.option = false;
                                this.listbox.setCurrentOptionStyle(false);
                            }
                        } else {
                            this.listbox.close();
                            this.option = false;
                            this.setActiveDescendant(false);
                        }
                    } else if (this.domNode.value.length) {
                        this.listbox.open();
                    }
                }
                if (this.filter != '' && this.option.textContent == undefined) {
                    this.removeVisualFocusAll();
                    this.filter = '';
                    this.setValue('');
                    this.domNode.blur();
                    this.toogleFilters();
                }
                break;
        }
        if (flag) {
            event.stopPropagation();
            event.preventDefault();
        }
    };

    /**
     * Click event
     * @function
     * @memberof ComboBox 
     * @param {object} event - The event of the click 
     */
    handleClick(event) {
        this.setValue('');
    };

    /**
     * Focus event
     * @function
     * @memberof ComboBox 
     * @param {object} event - The event of the focus 
     */
    handleFocus(event) {
        if (this.listbox.isOpen()) {
            this.listbox.close(true);
        } else {
            this.setVisualFocusTextbox();
            this.option = false;
            this.listbox.setCurrentOptionStyle(null);

            this.listbox.open();
            this.toogleFilters();
        }
    };

    /**
     * Blur event
     * @function
     * @memberof ComboBox 
     * @param {object} event - The event of the blur 
     */
    handleBlur(event) {
        this.listbox.hasFocus = false;
        this.listbox.setCurrentOptionStyle(null);
        this.removeVisualFocusAll();
        const iconElement = this.domNode.nextElementSibling;
        switch (this.domNode.id) {
            case "cb-ingredients__input":
                this.domNode.placeholder = "Ingrédients";
                break;
            case "cb-appareils__input":
                this.domNode.placeholder = "Appareils";
                break;
            case "cb-ustensiles__input":
                this.domNode.placeholder = "Ustensiles";
                break;
        }
        iconElement.classList.remove('icon--chevron-up');
        iconElement.classList.add('icon--chevron-down');

        const preservedThis = this;
        setTimeout(function() {
            preservedThis.removeVisualFocusAll();
            preservedThis.filter = '';
            preservedThis.setValue('');
            preservedThis.domNode.blur();
            preservedThis.listbox.close(true);
        }, 300);
    };

    /**
     * Button click event
     * @function
     * @memberof ComboBox 
     * @param {object} event - The event of the button click 
     */
    handleButtonClick(event) {
        if (this.listbox.isOpen()) {
            this.setValue('');
            this.listbox.close(true);
        } else {
            this.filter = '';
            this.setValue('');
            this.toogleFilters();
        }
    };

    /**
     * Button keyup event
     * @function
     * @memberof ComboBox 
     * @param {object} event - The event of the button keyup 
     */
    handleButtonKeyUp(event) {
        if (event.keyCode === this.keyCode.RETURN) {
            if (this.listbox.isOpen()) {
                this.setValue('');
                this.listbox.close(true);
            } else {
                this.filter = '';
                this.setValue('');
                this.toogleFilters();
            }
        }
    };






    /**
     * Toogle event
     * @function
     * @memberof ComboBox 
     * @param {object} event - The event of the toogle 
     */
    toogleFilters(event) {
        const iconElement = this.domNode.nextElementSibling;
        if (this.domNode.getAttribute('aria-expanded') == 'true') {
            switch (this.domNode.id) {
                case "cb-ingredients__input":
                    this.domNode.placeholder = "Recherche un ingrédient"
                    break;
                case "cb-appareils__input":
                    this.domNode.placeholder = "Recherche un appareil"
                    break;
                case "cb-ustensiles__input":
                    this.domNode.placeholder = "Recherche un ustensile"
                    break;
            }
            iconElement.classList.remove('icon--chevron-down');
            iconElement.classList.add('icon--chevron-up');
        } else {
            switch (this.domNode.id) {
                case "cb-ingredients__input":
                    this.domNode.placeholder = "Ingrédients"
                    break;
                case "cb-appareils__input":
                    this.domNode.placeholder = "Appareils"
                    break;
                case "cb-ustensiles__input":
                    this.domNode.placeholder = "Ustensiles"
                    break;
            }
            iconElement.classList.remove('icon--chevron-up');
            iconElement.classList.add('icon--chevron-down');
        }
        this.domNode.focus();
        this.setVisualFocusTextbox();
    }
}