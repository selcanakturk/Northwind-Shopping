import * as actionTypes from "../actions/actionTypes.jsx";
import initialState from "./initialState.jsx";

export default function productListReducer(
  state = { data: [], loading: false, error: null },
  action
) {
  switch (action.type) {
    case actionTypes.GET_PRODUCTS_LOADING:
      return { ...state, loading: true, error: null };
    case actionTypes.GET_PRODUCTS_SUCCESS:
      return { ...state, data: action.payload, loading: false, error: null };
    case actionTypes.GET_PRODUCTS_ERROR:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
