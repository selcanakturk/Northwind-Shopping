import { combineReducers } from "redux";
import changeCategoryReducer from "./changeCategoryReducer";
import categoryListReducer from "./categoryListReducer";
import productListReducer from "./productListReducer";
import cartReducer from "./cartReducer";
import saveProductReducer from "./saveProductReducer";
import favoriteReducer from "./favoriteReducer.jsx";
import authReducer from "./authReducer.jsx";
import couponReducer from "./couponReducer.jsx";
import reviewReducer from "./reviewReducer.jsx";
import orderReducer from "./orderReducer.jsx";
import userReducer from "./userReducer.jsx";

const rootReducer = combineReducers({
  changeCategoryReducer,
  categoryListReducer,
  productListReducer,
  cartReducer,
  saveProductReducer,
  favoriteReducer,
  authReducer,
  couponReducer,
  reviewReducer,
  orderReducer,
  userReducer,
});

export default rootReducer;
