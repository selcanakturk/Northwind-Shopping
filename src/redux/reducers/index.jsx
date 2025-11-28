import { combineReducers } from "redux";
import changeCategoryReducer from "./changeCategoryReducer";
import categoryListReducer from "./categoryListReducer";
import productListReducer from "./productListReducer";
import cartReducer from "./cartReducer";
import saveProductReducer from "./saveProductReducer";
import favoriteReducer from "./favoriteReducer.jsx";

const rootReducer = combineReducers({
  changeCategoryReducer,
  categoryListReducer,
  productListReducer,
  cartReducer,
  saveProductReducer,
  favoriteReducer,
});

export default rootReducer;
