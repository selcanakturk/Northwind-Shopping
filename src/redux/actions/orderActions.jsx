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
  return (dispatch, getState) => {
    const auth = getState().authReducer;
    const orders = loadOrdersFromStorage();
    
    if (auth.user && auth.user.role === "admin") {
      dispatch({ type: actionTypes.GET_ORDERS_SUCCESS, payload: orders });
      return orders;
    }
    
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
    alertify.success(`Order ${updatedOrder.orderNumber || updatedOrder.id} status updated to ${newStatus}.`);
    return updatedOrder;
  };
}

export function deleteOrderSuccess(orderId) {
  return { type: actionTypes.DELETE_ORDER_SUCCESS, payload: orderId };
}

export function deleteOrder(orderId) {
  return (dispatch) => {
    const orders = loadOrdersFromStorage();
    const order = orders.find((o) => o.id === orderId);
    
    if (!order) {
      alertify.error("Order not found.");
      return;
    }

    const updatedOrders = orders.filter((order) => order.id !== orderId);
    saveOrdersToStorage(updatedOrders);
    dispatch(deleteOrderSuccess(orderId));
    alertify.success(`Order ${order.orderNumber || orderId} deleted successfully.`);
  };
}

export function addOrderNoteSuccess(order) {
  return { type: actionTypes.ADD_ORDER_NOTE_SUCCESS, payload: order };
}

export function addOrderNote(orderId, note) {
  return (dispatch) => {
    const orders = loadOrdersFromStorage();
    const order = orders.find((o) => o.id === orderId);
    
    if (!order) {
      alertify.error("Order not found.");
      return;
    }

    const notes = order.notes || [];
    const newNote = {
      id: Date.now(),
      text: note,
      createdAt: new Date().toISOString(),
      createdBy: "admin",
    };

    const updatedOrder = {
      ...order,
      notes: [...notes, newNote],
    };

    const updatedOrders = orders.map((o) => (o.id === orderId ? updatedOrder : o));
    saveOrdersToStorage(updatedOrders);
    dispatch(addOrderNoteSuccess(updatedOrder));
    alertify.success("Note added successfully.");
    return updatedOrder;
  };
}

export function bulkUpdateOrderStatus(orderIds, newStatus) {
  return (dispatch) => {
    const orders = loadOrdersFromStorage();
    const updatedOrders = orders.map((order) =>
      orderIds.includes(order.id) ? { ...order, status: newStatus } : order
    );
    saveOrdersToStorage(updatedOrders);
    
    orderIds.forEach((orderId) => {
      const updatedOrder = updatedOrders.find((order) => order.id === orderId);
      if (updatedOrder) {
        dispatch({ type: actionTypes.UPDATE_ORDER_STATUS_SUCCESS, payload: updatedOrder });
      }
    });
    
    alertify.success(`${orderIds.length} order(s) status updated to ${newStatus}.`);
  };
}

