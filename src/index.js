 // Import SASS for WebPack
 import "../scss/style.scss";
 import recipes from "../data/recipes.js";
 import ComboBox from './view/combobox/ComboBox.js';


 // Instanciate the comboboxes filters
 const comboBox = new ComboBox();



 function isInTheReceipe(array, oldWord) {
     const word = oldWord.toLowerCase().trim();
     return array.filter(function(currentElement) {
         return (currentElement.name.toLowerCase().includes(word) || currentElement.description.toLowerCase().includes(word) || currentElement.ingredients.findIndex(item => word === item.toString().toLowerCase()) != -1);
     });
 }

 isInTheReceipe(recipes, '  cOc');