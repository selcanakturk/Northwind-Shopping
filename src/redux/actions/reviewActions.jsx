import * as actionTypes from "./actionTypes.jsx";
import alertify from "alertifyjs";

const loadReviewsFromStorage = () => {
  try {
    const serializedReviews = localStorage.getItem("reviews");
    if (serializedReviews === null) {
      return [];
    }
    return JSON.parse(serializedReviews);
  } catch (err) {
    console.error("Reviews yüklenirken hata oluştu:", err);
    return [];
  }
};

const saveReviewsToStorage = (reviews) => {
  try {
    localStorage.setItem("reviews", JSON.stringify(reviews));
  } catch (err) {
    console.error("Reviews kaydedilirken hata oluştu:", err);
  }
};

export function getReviews(productId) {
  return (dispatch) => {
    const allReviews = loadReviewsFromStorage();
    const productReviews = allReviews.filter((review) => review.productId === productId);
    dispatch({ type: actionTypes.GET_REVIEWS_SUCCESS, payload: { productId, reviews: productReviews } });
  };
}

export function addReview(reviewData) {
  return (dispatch, getState) => {
    const auth = getState().authReducer;
    if (!auth.isAuthenticated) {
      alertify.error("Please login to submit a review.");
      return false;
    }

    const allReviews = loadReviewsFromStorage();
    const newReview = {
      id: allReviews.length > 0 ? Math.max(...allReviews.map((r) => r.id)) + 1 : 1,
      ...reviewData,
      userId: auth.user.id,
      username: auth.user.username,
      date: new Date().toISOString(),
    };

    const updatedReviews = [...allReviews, newReview];
    saveReviewsToStorage(updatedReviews);

    dispatch({ type: actionTypes.ADD_REVIEW_SUCCESS, payload: newReview });
    alertify.success("Review submitted successfully!");
    return true;
  };
}

export function deleteReview(reviewId) {
  return (dispatch, getState) => {
    const auth = getState().authReducer;
    const allReviews = loadReviewsFromStorage();
    const review = allReviews.find((r) => r.id === reviewId);

    if (!review) {
      alertify.error("Review not found.");
      return false;
    }

    if (auth.user.role !== "admin" && review.userId !== auth.user.id) {
      alertify.error("You can only delete your own reviews.");
      return false;
    }

    const updatedReviews = allReviews.filter((r) => r.id !== reviewId);
    saveReviewsToStorage(updatedReviews);

    dispatch({ type: actionTypes.DELETE_REVIEW_SUCCESS, payload: reviewId });
    alertify.success("Review deleted successfully!");
    return true;
  };
}

export function getAllReviews() {
  return (dispatch) => {
    const allReviews = loadReviewsFromStorage();
    dispatch({ type: actionTypes.GET_REVIEWS_SUCCESS, payload: { productId: null, reviews: allReviews } });
  };
}

