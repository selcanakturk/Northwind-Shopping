import * as actionTypes from "../actions/actionTypes";
import initialState from "./initialState";

const saveCartToStorage = (cart) => {
  try {
    const serializedCart = JSON.stringify(cart);
    localStorage.setItem("cart", serializedCart);
  } catch (err) {
    console.error("Cart kaydedilirken hata oluştu:", err);
  }
};

export default function cartReducer(state = initialState.cart, action) {
  let newState;

  switch (action.type) {
    case actionTypes.ADD_TO_CART:
      var addedItem = state.find(
        (c) => c.product.id === action.payload.product.id
      );
      if (addedItem) {
        newState = state.map((cartItem) => {
          if (cartItem.product.id === action.payload.product.id) {
            return Object.assign({}, addedItem, {
              quantity: addedItem.quantity + 1,
            });
          }
          return cartItem;
        });
      } else {
        newState = [...state, { ...action.payload }];
      }
      saveCartToStorage(newState);
      return newState;

    case actionTypes.REMOVE_FROM_CART: {
      newState = state.filter(
        (cartItem) => cartItem.product.id !== action.payload.id
      );
      saveCartToStorage(newState);
      return newState;
    }

    case actionTypes.UPDATE_CART_QUANTITY: {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        newState = state.filter(
          (cartItem) => cartItem.product.id !== productId
        );
      } else {
        newState = state.map((cartItem) => {
          if (cartItem.product.id === productId) {
            return { ...cartItem, quantity };
          }
          return cartItem;
        });
      }
      saveCartToStorage(newState);
      return newState;
    }

    default:
      return state;
  }
}
