/**
 * Dynamically change the placeholders of the filters
 */
const preservedThis = this;
$('#filtre1').on('show.bs.dropdown', preservedThis, function() {
    const filtreIngredients = $('.filtre--ingredients')
    filtreIngredients.attr("placeholder", "Recherche un ingrédient");
    filtreIngredients.css("width", "auto");
    toogleDropdownChevrons(filtreIngredients)
})
$('#filtre1').on('hide.bs.dropdown', preservedThis, function() {
    const filtreIngredients = $('.filtre--ingredients');
    filtreIngredients.attr("placeholder", "Ingrédients");
    filtreIngredients.css("width", "12em");
    if (window.matchMedia('(max-width: 768px)').matches) {
        filtreIngredients.css("width", "auto");
    } else filtreIngredients.css("width", "12em");
    clearFilters(filtreIngredients);
    toogleDropdownChevrons(filtreIngredients)
})
$('#filtre2').on('show.bs.dropdown', preservedThis, function() {
    const filtreAppareil = $('.filtre--appareils');
    filtreAppareil.attr("placeholder", "Recherche un appareil");
    filtreAppareil.css("width", "auto");
    toogleDropdownChevrons(filtreAppareil)

})
$('#filtre2').on('hide.bs.dropdown', preservedThis, function() {
    const filtreAppareil = $('.filtre--appareils');
    filtreAppareil.attr("placeholder", "Appareils");
    if (window.matchMedia('(max-width: 768px)').matches) {
        filtreAppareil.css("width", "auto");
    } else filtreAppareil.css("width", "12em");
    clearFilters(filtreAppareil);;
    toogleDropdownChevrons(filtreAppareil)

})
$('#filtre3').on('show.bs.dropdown', preservedThis, function() {
    const filtreUstensiles = $('.filtre--ustensiles');
    filtreUstensiles.attr("placeholder", "Recherche un ustensile");
    filtreUstensiles.css("width", "auto");
    toogleDropdownChevrons(filtreUstensiles)

})
$('#filtre3').on('hide.bs.dropdown', preservedThis, function() {
    const filtreUstensiles = $('.filtre--ustensiles');
    filtreUstensiles.attr("placeholder", "Ustensiles");
    if (window.matchMedia('(max-width: 768px)').matches) {
        filtreUstensiles.css("width", "auto");
    } else filtreUstensiles.css("width", "12em");
    clearFilters(filtreUstensiles);;
    toogleDropdownChevrons(filtreUstensiles)

})

/**
 * Remove all filters contents and blur
 */
function clearFilters(inputElement) {
    inputElement.val('');
    inputElement.blur();
}

/**
 * Toogle dropdown chevron
 */
function toogleDropdownChevrons(inputElement) {
    const iconElement = inputElement.next()
    if (iconElement.hasClass("icon--chevron-down")) {
        iconElement.addClass('icon--chevron-up').removeClass('icon--chevron-down');
    } else {
        iconElement.addClass('icon--chevron-down').removeClass('icon--chevron-up');
    }
}