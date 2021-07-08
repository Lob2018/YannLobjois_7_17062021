 // Import SASS for WebPack
 import "../scss/style.scss";
 import ComboBox from './view/combobox/ComboBox.js';
 import AllRecipes from "./entity/AllRecipes.js";
 import Search from "./view/Search.js";


 // Instanciate the comboboxes filters
 new ComboBox();
 // Instanciate for all the recipes
 new AllRecipes();
 // Instanciate the search engine
 new Search();