const loadCartFromStorage = () => {
  try {
    const serializedCart = localStorage.getItem("cart");
    if (serializedCart === null) {
      return [];
    }
    return JSON.parse(serializedCart);
  } catch (err) {
    console.error("Cart yüklenirken hata oluştu:", err);
    return [];
  }
};

const loadFavoritesFromStorage = () => {
  try {
    const serializedFavorites = localStorage.getItem("favorites");
    if (serializedFavorites === null) {
      return [];
    }
    return JSON.parse(serializedFavorites);
  } catch (err) {
    console.error("Favorites yüklenirken hata oluştu:", err);
    return [];
  }
};

const loadAuthFromStorage = () => {
  try {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    if (token && user) {
      return { isAuthenticated: true, user, token, error: null };
    }
    return { isAuthenticated: false, user: null, token: null, error: null };
  } catch (err) {
    console.error("Auth yüklenirken hata oluştu:", err);
    return { isAuthenticated: false, user: null, token: null, error: null };
  }
};

export default {
  currentCategory: {},
  categories: [],
  products: [],
  productsLoading: false,
  productsError: null,
  cart: loadCartFromStorage(),
  saveProduct: {},
  favorites: loadFavoritesFromStorage(),
  auth: loadAuthFromStorage(),
  coupon: {
    coupons: [],
    appliedCoupon: null,
    discountAmount: 0,
  },
};
