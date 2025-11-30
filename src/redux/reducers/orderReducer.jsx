import * as actionTypes from "../actions/actionTypes.jsx";
import initialState from "./initialState.jsx";

const loadOrdersFromStorage = () => {
  try {
    const serializedOrders = localStorage.getItem("orders");
    if (serializedOrders === null) {
      return [];
    }
    return JSON.parse(serializedOrders);
  } catch (err) {
    console.error("Orders yüklenirken hata oluştu:", err);
    return [];
  }
};

export default function orderReducer(state = initialState.orders, action) {
  const currentOrders = state.orders || loadOrdersFromStorage();
  switch (action.type) {
    case actionTypes.CREATE_ORDER_SUCCESS:
      const newOrdersCreate = [...currentOrders, action.payload];
      localStorage.setItem("orders", JSON.stringify(newOrdersCreate));
      return {
        ...state,
        orders: newOrdersCreate,
      };
    case actionTypes.GET_ORDERS_SUCCESS:
      const ordersToSet = Array.isArray(action.payload) ? action.payload : [];
      return {
        ...state,
        orders: ordersToSet,
      };
    case actionTypes.UPDATE_ORDER_STATUS_SUCCESS:
      const newOrdersUpdate = currentOrders.map((order) =>
        order && order.id === action.payload.id ? action.payload : order
      );
      localStorage.setItem("orders", JSON.stringify(newOrdersUpdate));
      return {
        ...state,
        orders: newOrdersUpdate,
      };
    default:
      return {
        ...state,
        orders: currentOrders,
      };
  }
}

