import * as actionTypes from "./actionTypes";

export function addToCart(cartItem) {
  return { type: actionTypes.ADD_TO_CART, payload: cartItem };
}

export function removeFromCart(product) {
  return { type: actionTypes.REMOVE_FROM_CART, payload: product };
}

export function updateCartQuantity(productId, quantity) {
  return {
    type: actionTypes.UPDATE_CART_QUANTITY,
    payload: { productId, quantity },
  };
}
