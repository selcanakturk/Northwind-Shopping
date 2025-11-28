import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Row, Col } from "reactstrap";
import { bindActionCreators } from "redux";
import * as categoryActions from "../../redux/actions/categoryActions.jsx";
import * as productActions from "../../redux/actions/productActions.jsx";

class CategoryShowcase extends Component {
  componentDidMount() {
    if (!this.props.categories || this.props.categories.length === 0) {
      this.props.actions.getCategories();
    }
  }

  handleCategoryClick = (categoryId, e) => {
    if (e) {
      e.preventDefault();
    }
    const category = this.props.categories.find((cat) => cat.id === categoryId);
    if (category) {
      this.props.actions.changeCategory(category);
      this.props.actions.getProducts(categoryId);
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
    }
  };

  render() {
    const { categories } = this.props;
    const displayCategories = (categories || []).slice(0, 6);

    if (!displayCategories || displayCategories.length === 0) {
      return null;
    }

    return (
      <div style={{ marginBottom: "4rem" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h2
            style={{
              fontSize: "2rem",
              fontWeight: "300",
              letterSpacing: "2px",
              color: "#1a1a1a",
              marginBottom: "0.5rem",
            }}
          >
            Shop by Category
          </h2>
          <p style={{ color: "#6b7280", fontSize: "0.875rem" }}>
            Explore our curated collections
          </p>
        </div>

        <Row className="g-4">
          {displayCategories.map((category) => (
            <Col key={category.id} md="4" sm="6" xs="12">
              <Link
                to="/"
                onClick={(e) => this.handleCategoryClick(category.id, e)}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "block",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "300px",
                    backgroundColor: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#1a1a1a";
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(0, 0, 0, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e5e7eb";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: "2rem",
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
                    }}
                  >
                    <h3
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: "400",
                        color: "#ffffff",
                        margin: 0,
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                      }}
                    >
                      {category.categoryName}
                    </h3>
                  </div>
                </div>
              </Link>
            </Col>
          ))}
        </Row>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    categories: state.categoryListReducer || [],
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

export default connect(mapStateToProps, mapDispatchToProps)(CategoryShowcase);

