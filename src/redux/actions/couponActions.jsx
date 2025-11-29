import * as actionTypes from "./actionTypes.jsx";
import alertify from "alertifyjs";

const loadCouponsFromStorage = () => {
  try {
    const serializedCoupons = localStorage.getItem("coupons");
    if (serializedCoupons === null) {
      const defaultCoupons = [
        {
          id: 1,
          code: "WELCOME10",
          discount: 10,
          discountType: "percentage",
          minPurchase: 0,
          maxDiscount: 50,
          validFrom: new Date().toISOString(),
          validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          isActive: true,
        },
        {
          id: 2,
          code: "SAVE20",
          discount: 20,
          discountType: "percentage",
          minPurchase: 50,
          maxDiscount: 100,
          validFrom: new Date().toISOString(),
          validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          isActive: true,
        },
        {
          id: 3,
          code: "FLAT15",
          discount: 15,
          discountType: "fixed",
          minPurchase: 0,
          maxDiscount: null,
          validFrom: new Date().toISOString(),
          validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          isActive: true,
        },
      ];
      localStorage.setItem("coupons", JSON.stringify(defaultCoupons));
      return defaultCoupons;
    }
    return JSON.parse(serializedCoupons);
  } catch (err) {
    console.error("Coupons yüklenirken hata oluştu:", err);
    return [];
  }
};

const saveCouponsToStorage = (coupons) => {
  try {
    localStorage.setItem("coupons", JSON.stringify(coupons));
  } catch (err) {
    console.error("Coupons kaydedilirken hata oluştu:", err);
  }
};

export function getCoupons() {
  return (dispatch) => {
    const coupons = loadCouponsFromStorage();
    dispatch({ type: actionTypes.GET_COUPONS_SUCCESS, payload: coupons });
  };
}

export function applyCoupon(code, subtotal) {
  return (dispatch) => {
    const coupons = loadCouponsFromStorage();
    const coupon = coupons.find(
      (c) =>
        c.code.toUpperCase() === code.toUpperCase() &&
        c.isActive &&
        new Date(c.validFrom) <= new Date() &&
        new Date(c.validUntil) >= new Date()
    );

    if (!coupon) {
      alertify.error("Invalid or expired coupon code.");
      return false;
    }

    if (subtotal < coupon.minPurchase) {
      alertify.error(`Minimum purchase of $${coupon.minPurchase} required.`);
      return false;
    }

    let discountAmount = 0;
    if (coupon.discountType === "percentage") {
      discountAmount = (subtotal * coupon.discount) / 100;
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      discountAmount = coupon.discount;
    }

    dispatch({
      type: actionTypes.APPLY_COUPON,
      payload: {
        coupon,
        discountAmount,
      },
    });

    alertify.success(`Coupon "${coupon.code}" applied!`);
    return true;
  };
}

export function removeCoupon() {
  return (dispatch) => {
    dispatch({ type: actionTypes.REMOVE_COUPON });
    alertify.success("Coupon removed.");
  };
}

export function createCoupon(couponData) {
  return (dispatch) => {
    const coupons = loadCouponsFromStorage();
    const newCoupon = {
      id: coupons.length > 0 ? Math.max(...coupons.map((c) => c.id)) + 1 : 1,
      ...couponData,
      isActive: couponData.isActive !== undefined ? couponData.isActive : true,
    };
    const updatedCoupons = [...coupons, newCoupon];
    saveCouponsToStorage(updatedCoupons);
    dispatch({ type: actionTypes.CREATE_COUPON_SUCCESS, payload: newCoupon });
    alertify.success("Coupon created successfully!");
    return newCoupon;
  };
}

export function deleteCoupon(couponId) {
  return (dispatch) => {
    const coupons = loadCouponsFromStorage();
    const updatedCoupons = coupons.filter((c) => c.id !== couponId);
    saveCouponsToStorage(updatedCoupons);
    dispatch({ type: actionTypes.DELETE_COUPON_SUCCESS, payload: couponId });
    alertify.success("Coupon deleted successfully!");
  };
}

export function updateCoupon(couponId, couponData) {
  return (dispatch) => {
    const coupons = loadCouponsFromStorage();
    const updatedCoupons = coupons.map((c) =>
      c.id === couponId ? { ...c, ...couponData } : c
    );
    saveCouponsToStorage(updatedCoupons);
    dispatch({ type: actionTypes.GET_COUPONS_SUCCESS, payload: updatedCoupons });
    alertify.success("Coupon updated successfully!");
  };
}

