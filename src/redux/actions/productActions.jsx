import * as actionTypes from "./actionTypes.jsx";

export function getProductsSuccess(products) {
  return { type: actionTypes.GET_PRODUCTS_SUCCESS, payload: products };
}

export function createProductSuccess(product) {
  return {
    type: actionTypes.CREATE_PRODUCT_SUCCESS,
    payload: product,
  };
}
export function updateProductSuccess(product) {
  return {
    type: actionTypes.UPDATE_PRODUCT_SUCCESS,
    payload: product,
  };
}
export function saveProductApi(product) {
  const isUpdate = product.id && product.id !== "";
  const url = isUpdate
    ? `http://localhost:3000/products/${product.id}`
    : "http://localhost:3000/products";

  const productToSend = {
    ...product,
    id: typeof product.id === 'string' ? parseInt(product.id, 10) : product.id
  };

  return fetch(url, {
    method: isUpdate ? "PUT" : "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(productToSend),
  })
    .then(handleResponse)
    .catch(handleError);
}

export function saveProduct(product) {
  return function (dispatch) {
    return saveProductApi(product)
      .then((savedProduct) => {
        product.id
          ? dispatch(updateProductSuccess(savedProduct))
          : dispatch(createProductSuccess(savedProduct));
      })
      .catch((error) => {
        throw error;
      });
  };
}

export async function handleResponse(response) {
  if (response.ok) {
    return response.json();
  }
  const error = await response.text();
  throw new Error(error);
}
export function handleError(error) {
  console.log("Bir hata oluştu!");
  throw error;
}

export function getProductsLoading() {
  return { type: actionTypes.GET_PRODUCTS_LOADING };
}

export function getProductsError(error) {
  return { type: actionTypes.GET_PRODUCTS_ERROR, payload: error };
}

export function getProducts(categoryId) {
  return function (dispatch) {
    dispatch(getProductsLoading());
    let url = "http://localhost:3000/products";
    if (categoryId) {
      url = url + "?categoryId=" + categoryId;
    }
    return fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Ürünler yüklenirken hata oluştu");
        }
        return response.json();
      })
      .then((result) => dispatch(getProductsSuccess(result)))
      .catch((error) => {
        dispatch(getProductsError(error.message));
        console.error("Ürünler yüklenirken hata:", error);
      });
  };
}
