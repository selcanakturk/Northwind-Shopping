import React, { Component } from "react";
import { connect } from "react-redux";
import ProductList from "../products/ProductList.jsx";
import HeroSlider from "../home/HeroSlider.jsx";
import FeaturedProducts from "../home/FeaturedProducts.jsx";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAllProducts: false,
    };
  }

  componentDidMount() {
    window.addEventListener("showAllProducts", this.handleShowAllProducts);
    window.addEventListener("categorySelected", this.handleCategorySelected);
    window.addEventListener("goToHomepage", this.handleGoToHomepage);
  }

  componentWillUnmount() {
    window.removeEventListener("showAllProducts", this.handleShowAllProducts);
    window.removeEventListener("categorySelected", this.handleCategorySelected);
    window.removeEventListener("goToHomepage", this.handleGoToHomepage);
  }

  handleShowAllProducts = () => {
    this.setState({ showAllProducts: true });
  };

  handleCategorySelected = () => {
    this.setState({ showAllProducts: true });
  };

  handleGoToHomepage = () => {
    this.setState({ showAllProducts: false });
  };

  componentDidUpdate(prevProps) {
    if (
      prevProps.currentCategory?.id !== this.props.currentCategory?.id
    ) {
      if (this.props.currentCategory?.id) {
        this.setState({ showAllProducts: true });
      } else {
        this.setState({ showAllProducts: false });
      }
    }
  }

  render() {
    const { currentCategory } = this.props;
    const { showAllProducts } = this.state;

    const shouldShowProductList =
      showAllProducts || (currentCategory && currentCategory.id);

    return (
      <div>
        {!shouldShowProductList ? (
          <>
            <div style={{ marginLeft: "-1rem", marginRight: "-1rem" }}>
              <HeroSlider />
            </div>
            <div style={{ padding: "0 1rem" }}>
              <FeaturedProducts />
            </div>
          </>
        ) : (
          <div style={{ padding: "2rem 0" }}>
            <ProductList />
          </div>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentCategory: state.changeCategoryReducer,
  };
}

export default connect(mapStateToProps)(Dashboard);

