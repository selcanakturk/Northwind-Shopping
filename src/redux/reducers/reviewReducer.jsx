import * as actionTypes from "../actions/actionTypes.jsx";
import initialState from "./initialState.jsx";

export default function reviewReducer(state = initialState.reviews, action) {
  switch (action.type) {
    case actionTypes.GET_REVIEWS_SUCCESS:
      if (action.payload.productId) {
        return {
          ...state,
          [action.payload.productId]: action.payload.reviews,
        };
      }
      return {
        ...state,
        all: action.payload.reviews,
      };
    case actionTypes.ADD_REVIEW_SUCCESS:
      const productId = action.payload.productId;
      const existingReviews = state[productId] || [];
      return {
        ...state,
        [productId]: [...existingReviews, action.payload],
      };
    case actionTypes.DELETE_REVIEW_SUCCESS:
      const newState = { ...state };
      for (const productId in newState) {
        if (productId !== "all") {
          newState[productId] = newState[productId].filter(
            (review) => review.id !== action.payload
          );
        }
      }
      if (newState.all) {
        newState.all = newState.all.filter((review) => review.id !== action.payload);
      }
      return newState;
    default:
      return state;
  }
}

