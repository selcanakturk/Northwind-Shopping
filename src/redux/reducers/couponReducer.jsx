import * as actionTypes from "../actions/actionTypes.jsx";
import initialState from "./initialState.jsx";

export default function couponReducer(state = initialState.coupon, action) {
  switch (action.type) {
    case actionTypes.GET_COUPONS_SUCCESS:
      return {
        ...state,
        coupons: action.payload,
      };
    case actionTypes.APPLY_COUPON:
      return {
        ...state,
        appliedCoupon: action.payload.coupon,
        discountAmount: action.payload.discountAmount,
      };
    case actionTypes.REMOVE_COUPON:
      return {
        ...state,
        appliedCoupon: null,
        discountAmount: 0,
      };
    case actionTypes.CREATE_COUPON_SUCCESS:
      return {
        ...state,
        coupons: [...state.coupons, action.payload],
      };
    case actionTypes.DELETE_COUPON_SUCCESS:
      return {
        ...state,
        coupons: state.coupons.filter((c) => c.id !== action.payload),
        appliedCoupon:
          state.appliedCoupon && state.appliedCoupon.id === action.payload
            ? null
            : state.appliedCoupon,
        discountAmount:
          state.appliedCoupon && state.appliedCoupon.id === action.payload
            ? 0
            : state.discountAmount,
      };
    default:
      return state;
  }
}

