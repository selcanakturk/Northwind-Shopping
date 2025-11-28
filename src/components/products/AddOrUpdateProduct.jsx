import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import * as categoryActions from "../../redux/actions/categoryActions.jsx";
import * as productActions from "../../redux/actions/productActions.jsx";
import ProductDetailForm from "./ProductDetailForm.jsx";

function AddOrUpdateProduct({
  products,
  categories,
  getCategories,
  getProducts,
  saveProduct,
}) {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [product, setProduct] = useState({});
  const [errors, setErrors] = useState({});

  function getProductById(products, productId) {
    if (!products || !Array.isArray(products)) return null;
    const id =
      typeof productId === "string" ? parseInt(productId, 10) : productId;
    return (
      products.find((p) => {
        const productIdNum =
          typeof p.id === "string" ? parseInt(p.id, 10) : p.id;
        return productIdNum === id;
      }) || null
    );
  }

  useEffect(() => {
    if (!categories || categories.length === 0) {
      getCategories();
    }
    getProducts();
  }, [categories, getCategories, getProducts]);

  useEffect(() => {
    if (productId && products && products.length > 0) {
      const foundProduct = getProductById(products, productId);
      if (foundProduct) {
        const processedProduct = {
          ...foundProduct,
          unitPrice:
            typeof foundProduct.unitPrice === "string"
              ? parseFloat(foundProduct.unitPrice)
              : foundProduct.unitPrice,
          unitsInStock:
            typeof foundProduct.unitsInStock === "string"
              ? parseInt(foundProduct.unitsInStock, 10)
              : foundProduct.unitsInStock,
          categoryId:
            typeof foundProduct.categoryId === "string"
              ? parseInt(foundProduct.categoryId, 10)
              : foundProduct.categoryId,
        };
        setProduct(processedProduct);
      } else {
        setProduct({});
      }
    } else if (!productId) {
      setProduct({});
    }
  }, [productId, products]);

  function handleChange(event) {
    const { name, value } = event.target;
    let processedValue = value;

    if (
      name === "categoryId" ||
      name === "unitPrice" ||
      name === "unitsInStock"
    ) {
      processedValue = value === "" ? "" : parseFloat(value);
      if (isNaN(processedValue)) {
        processedValue = value;
      }
    }

    setProduct((prev) => ({
      ...prev,
      [name]: processedValue,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  }

  function validate() {
    const newErrors = {};

    if (!product.productName || product.productName.trim() === "") {
      newErrors.productName = "Ürün adı gereklidir";
    }

    if (!product.categoryId) {
      newErrors.categoryId = "Kategori seçimi gereklidir";
    }

    if (!product.unitPrice || product.unitPrice <= 0) {
      newErrors.unitPrice = "Geçerli bir fiyat giriniz";
    }

    if (!product.quantityPerUnit || product.quantityPerUnit.trim() === "") {
      newErrors.quantityPerUnit = "Birim miktarı gereklidir";
    }

    if (
      product.unitsInStock === undefined ||
      product.unitsInStock === null ||
      product.unitsInStock < 0
    ) {
      newErrors.unitsInStock = "Geçerli bir stok miktarı giriniz";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSave(event) {
    event.preventDefault();

    if (validate()) {
      const productToSave = { ...product };

      if (productToSave.id) {
        productToSave.id = typeof productToSave.id === 'string'
          ? parseInt(productToSave.id, 10)
          : productToSave.id;
      } else {
        if (products && products.length > 0) {
          const numericIds = products
            .map(p => {
              const id = typeof p.id === 'string' ? parseInt(p.id, 10) : p.id;
              return typeof id === 'number' && !isNaN(id) ? id : 0;
            })
            .filter(id => id > 0);

          const maxId = numericIds.length > 0 ? Math.max(...numericIds) : 0;
          productToSave.id = maxId + 1;
        } else {
          productToSave.id = 1;
        }
      }

      saveProduct(productToSave)
        .then(() => {
          navigate("/");
        })
        .catch((error) => {
          console.error("Ürün kaydedilirken hata oluştu:", error);
        });
    }
  }

  return (
    <ProductDetailForm
      product={product}
      categories={categories}
      onChange={handleChange}
      onSave={handleSave}
      errors={errors}
    />
  );
}

function mapStateToProps(state) {
  const productsData = state.productListReducer?.data || state.productListReducer || [];
  return {
    products: Array.isArray(productsData) ? productsData : [],
    categories: state.categoryListReducer || [],
  };
}

const mapDispatchToProps = {
  getCategories: categoryActions.getCategories,
  getProducts: productActions.getProducts,
  saveProduct: productActions.saveProduct,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddOrUpdateProduct);
