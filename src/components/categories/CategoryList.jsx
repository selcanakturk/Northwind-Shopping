import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as categoryActions from "../../redux/actions/categoryActions.jsx";
import * as productActions from "../../redux/actions/productActions.jsx";

class CategoryList extends Component {
  componentDidMount() {
    this.props.actions.getCategories();
  }

  selectCategory = (category) => {
    this.props.actions.changeCategory(category);
    this.props.actions.getProducts(category.id);
  };

  selectAllCategories = () => {
    this.props.actions.changeCategory({});
    this.props.actions.getProducts();
  };

  render() {
    return (
      <div className="modern-category-list">
        <div className="section-header">
          <h2 className="section-title">Categories</h2>
        </div>

        <div
          className={`category-item ${!this.props.currentCategory.id ? "active" : ""
            }`}
          onClick={this.selectAllCategories}
          style={{ cursor: "pointer" }}
        >
          <span style={{ fontSize: "0.875rem", fontWeight: "400" }}>
            All Categories
          </span>
        </div>

        {this.props.categories && this.props.categories.length > 0 ? (
          this.props.categories.map((category) => (
            <div
              className={`category-item ${category.id === this.props.currentCategory.id ? "active" : ""
                }`}
              onClick={() => this.selectCategory(category)}
              key={category.id}
            >
              <span style={{ fontSize: "1rem" }}>{category.categoryName}</span>
            </div>
          ))
        ) : (
          <div className="category-item">
            <span>Loading categories...</span>
          </div>
        )}
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    currentCategory: state.changeCategoryReducer,
    categories: state.categoryListReducer,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    actions: {
      getCategories: bindActionCreators(
        categoryActions.getCategories,
        dispatch
      ),
      changeCategory: bindActionCreators(
        categoryActions.changeCategory,
        dispatch
      ),
      getProducts: bindActionCreators(productActions.getProducts, dispatch),
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoryList);
