import * as actionTypes from "./actionTypes.jsx";

export function addToFavorites(product) {
    return { type: actionTypes.ADD_TO_FAVORITES, payload: product };
}

export function removeFromFavorites(productId) {
    return { type: actionTypes.REMOVE_FROM_FAVORITES, payload: productId };
}

