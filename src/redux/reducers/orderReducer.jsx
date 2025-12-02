import * as actionTypes from "../actions/actionTypes.jsx";
import initialState from "./initialState.jsx";

const loadAllOrdersFromStorage = () => {
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

const saveAllOrdersToStorage = (orders) => {
  try {
    localStorage.setItem("orders", JSON.stringify(orders));
  } catch (err) {
    console.error("Orders kaydedilirken hata oluştu:", err);
  }
};

const getUserId = () => {
  try {
    const userStr = localStorage.getItem("currentUser");
    if (userStr) {
      const user = JSON.parse(userStr);
      return user?.id || null;
    }
  } catch (err) {
    return null;
  }
  return null;
};

const getUserRole = () => {
  try {
    const userStr = localStorage.getItem("currentUser");
    if (userStr) {
      const user = JSON.parse(userStr);
      return user?.role || null;
    }
  } catch (err) {
    return null;
  }
  return null;
};

const getFilteredOrdersForUser = (allOrders) => {
  const userRole = getUserRole();
  if (userRole === "admin") {
    return allOrders;
  }
  const userId = getUserId();
  if (!userId) {
    return [];
  }
  return allOrders.filter((order) => order.userId === userId);
};

export default function orderReducer(state = initialState.orders, action) {
  switch (action.type) {
    case actionTypes.CREATE_ORDER_SUCCESS:
      const allOrdersAfterCreate = loadAllOrdersFromStorage();
      return {
        ...state,
        orders: getFilteredOrdersForUser(allOrdersAfterCreate),
      };
    case actionTypes.GET_ORDERS_SUCCESS:
      const ordersToSet = Array.isArray(action.payload) ? action.payload : [];
      return {
        ...state,
        orders: ordersToSet,
      };
    case actionTypes.UPDATE_ORDER_STATUS_SUCCESS:
      const allOrdersAfterUpdate = loadAllOrdersFromStorage();
      return {
        ...state,
        orders: getFilteredOrdersForUser(allOrdersAfterUpdate),
      };
    case actionTypes.DELETE_ORDER_SUCCESS:
      const allOrdersAfterDelete = loadAllOrdersFromStorage();
      return {
        ...state,
        orders: getFilteredOrdersForUser(allOrdersAfterDelete),
      };
    case actionTypes.ADD_ORDER_NOTE_SUCCESS:
      const allOrdersAfterNote = loadAllOrdersFromStorage();
      return {
        ...state,
        orders: getFilteredOrdersForUser(allOrdersAfterNote),
      };
    case actionTypes.LOGIN_SUCCESS:
    case actionTypes.REGISTER_SUCCESS:
      const allOrdersAfterAuth = loadAllOrdersFromStorage();
      return {
        ...state,
        orders: getFilteredOrdersForUser(allOrdersAfterAuth),
      };
    case actionTypes.LOGOUT:
      return {
        ...state,
        orders: [],
      };
    default:
      return state;
  }
}
