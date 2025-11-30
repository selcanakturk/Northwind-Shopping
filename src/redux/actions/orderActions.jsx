import * as actionTypes from "./actionTypes.jsx";
import alertify from "alertifyjs";

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

const saveOrdersToStorage = (orders) => {
  try {
    localStorage.setItem("orders", JSON.stringify(orders));
  } catch (err) {
    console.error("Orders kaydedilirken hata oluştu:", err);
  }
};

export function createOrder(orderData) {
  return (dispatch, getState) => {
    const auth = getState().authReducer;
    if (!auth.isAuthenticated) {
      alertify.error("Please login to place an order.");
      return false;
    }

    const orders = loadOrdersFromStorage();
    const newOrder = {
      id: orders.length > 0 ? Math.max(...orders.map((o) => o.id)) + 1 : 1,
      ...orderData,
      userId: auth.user.id,
      username: auth.user.username,
      orderDate: new Date().toISOString(),
      status: "pending",
      orderNumber: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    };

    const updatedOrders = [...orders, newOrder];
    saveOrdersToStorage(updatedOrders);

    dispatch({ type: actionTypes.CREATE_ORDER_SUCCESS, payload: newOrder });
    return newOrder;
  };
}

export function getOrders(userId = null) {
  return (dispatch) => {
    const orders = loadOrdersFromStorage();
    let filteredOrders = orders;

    if (userId) {
      filteredOrders = orders.filter((order) => order.userId === userId);
    }

    dispatch({ type: actionTypes.GET_ORDERS_SUCCESS, payload: filteredOrders });
    return filteredOrders;
  };
}

export function updateOrderStatus(orderId, newStatus) {
  return (dispatch) => {
    const orders = loadOrdersFromStorage();
    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    saveOrdersToStorage(updatedOrders);
    const updatedOrder = updatedOrders.find((order) => order.id === orderId);
    dispatch({ type: actionTypes.UPDATE_ORDER_STATUS_SUCCESS, payload: updatedOrder });
    alertify.success(`Order status updated to ${newStatus}.`);
    return updatedOrder;
  };
}

