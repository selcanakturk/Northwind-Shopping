import * as actionTypes from "../actions/actionTypes.jsx";
import initialState from "./initialState.jsx";

export default function saveProductReducer(
  state = initialState.saveProduct,
  action
) {
  switch (action.type) {
    case actionTypes.UPDATE_PRODUCT_SUCCESS:
      return action.payload;
    case actionTypes.CREATE_PRODUCT_SUCCESS:
      return action.payload;
    default:
      return state;
  }
}
