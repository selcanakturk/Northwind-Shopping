import * as actionTypes from "../actions/actionTypes.jsx";
import initialState from "./initialState.jsx";

export default function orderReducer(state = initialState.orders, action) {
  switch (action.type) {
    case actionTypes.CREATE_ORDER_SUCCESS:
      return {
        ...state,
        orders: [...state.orders, action.payload],
      };
    case actionTypes.GET_ORDERS_SUCCESS:
      return {
        ...state,
        orders: action.payload,
      };
    default:
      return state;
  }
}

