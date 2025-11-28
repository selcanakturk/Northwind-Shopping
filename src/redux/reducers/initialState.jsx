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

export default {
  currentCategory: {},
  categories: [],
  products: [],
  productsLoading: false,
  productsError: null,
  cart: loadCartFromStorage(),
  saveProduct: {},
};
