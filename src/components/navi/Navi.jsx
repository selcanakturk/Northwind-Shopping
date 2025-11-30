import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link } from "react-router-dom";
import {
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  NavbarToggler,
  Collapse,
  Input,
  InputGroup,
  InputGroupText,
} from "reactstrap";
import CartSummary from "../cart/CartSummary.jsx";
import * as categoryActions from "../../redux/actions/categoryActions.jsx";
import * as productActions from "../../redux/actions/productActions.jsx";
import * as authActions from "../../redux/actions/authActions.jsx";
import { Badge } from "reactstrap";

class Navi extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      searchTerm: "",
      categoryDropdownOpen: false,
    };
  }

  getCategoryIcon = (categoryName) => {
    const icons = {
      "Ottomans": (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
        </svg>
      ),
      "Benches": (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="10" width="20" height="4" rx="1" />
          <line x1="4" y1="10" x2="4" y2="20" />
          <line x1="20" y1="10" x2="20" y2="20" />
          <line x1="2" y1="14" x2="22" y2="14" />
        </svg>
      ),
      "Sofas": (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 10h20v8H2z" />
          <path d="M2 10l2-4h16l2 4" />
          <line x1="6" y1="18" x2="6" y2="10" />
          <line x1="18" y1="18" x2="18" y2="10" />
        </svg>
      ),
      "Accent Chairs": (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 10h14v10H5z" />
          <path d="M5 10l2-6h10l2 6" />
          <line x1="7" y1="20" x2="7" y2="10" />
          <line x1="17" y1="20" x2="17" y2="10" />
        </svg>
      ),
      "Coffee Tables": (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="12" width="18" height="2" rx="1" />
          <line x1="6" y1="12" x2="6" y2="20" />
          <line x1="18" y1="12" x2="18" y2="20" />
          <line x1="3" y1="13" x2="21" y2="13" />
        </svg>
      ),
      "TV Stands": (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="14" width="20" height="6" rx="1" />
          <rect x="4" y="4" width="16" height="10" rx="1" />
        </svg>
      ),
      "Dining Tables": (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <ellipse cx="12" cy="12" rx="10" ry="2" />
          <line x1="4" y1="12" x2="4" y2="20" />
          <line x1="20" y1="12" x2="20" y2="20" />
        </svg>
      ),
      "Beds": (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="8" width="20" height="12" rx="1" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M6 8V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v4" />
        </svg>
      ),
      "Outdoor": (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      ),
      "Decor": (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
      "Lighting": (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
      ),
    };
    return icons[categoryName] || (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="18" height="18" rx="2" />
      </svg>
    );
  };

  componentDidMount() {
    this.props.actions.getCategories();
    this.props.actions.getProducts();
    this.props.actions.checkAuth();
    document.addEventListener("click", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.handleClickOutside);
  }

  handleClickOutside = (event) => {
    if (
      this.state.categoryDropdownOpen &&
      !event.target.closest(".category-dropdown-container")
    ) {
      this.setState({ categoryDropdownOpen: false });
    }
  };

  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  toggleCategoryDropdown = () => {
    this.setState({ categoryDropdownOpen: !this.state.categoryDropdownOpen });
  };



  handleSearchChange = (e) => {
    this.setState({ searchTerm: e.target.value });
  };

  handleSearchSubmit = (e) => {
    e.preventDefault();
    if (this.state.searchTerm.trim()) {
      this.props.actions.changeCategory({});
      const event = new CustomEvent("searchProducts", {
        detail: { searchTerm: this.state.searchTerm },
      });
      window.dispatchEvent(event);

      const showProductsEvent = new CustomEvent("showAllProducts", { detail: {} });
      window.dispatchEvent(showProductsEvent);

      if (window.location.pathname !== "/") {
        window.location.href = "/";
      } else {
        setTimeout(() => {
          window.dispatchEvent(event);
          window.dispatchEvent(showProductsEvent);
        }, 100);
      }
    }
  };

  handleCategoryClick = (categoryIdOrName, e) => {
    if (e) {
      e.preventDefault();
    }

    if (categoryIdOrName === "All") {
      this.props.actions.changeCategory({});
      this.props.actions.getProducts();
      const event = new CustomEvent("categorySelected", { detail: { category: null } });
      window.dispatchEvent(event);
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
      return;
    }

    if (categoryIdOrName === "Sale") {
      this.props.actions.changeCategory({});
      this.props.actions.getProducts();
      const event = new CustomEvent("categorySelected", { detail: { category: "Sale" } });
      window.dispatchEvent(event);
      if (window.location.pathname !== "/") {
        window.location.href = "/";
      } else {
        setTimeout(() => {
          const saleEvent = new CustomEvent("filterSale", { detail: {} });
          window.dispatchEvent(saleEvent);
        }, 100);
      }
      return;
    }

    if (typeof categoryIdOrName === "number") {
      const category = this.props.categories.find(
        (cat) => cat.id === categoryIdOrName
      );
      if (category) {
        this.props.actions.changeCategory(category);
        this.props.actions.getProducts(categoryIdOrName);
        const event = new CustomEvent("categorySelected", { detail: { category } });
        window.dispatchEvent(event);
        if (window.location.pathname !== "/") {
          window.location.href = "/";
        }
      }
    }
  };

  render() {
    return (
      <div>
        <div
          style={{
            background: "#1a1a1a",
            color: "#ffffff",
            padding: "0.5rem 0",
            fontSize: "0.75rem",
          }}
        >
          <div className="container">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex gap-4">
                <NavLink
                  href="/"
                  style={{ color: "#ffffff", textDecoration: "none" }}
                >
                  Northwind
                </NavLink>
              </div>
              <div className="d-flex gap-3 align-items-center">
                {this.props.auth.isAuthenticated ? (
                  <>
                    <Link
                      to="/account"
                      style={{
                        color: "#ffffff",
                        textDecoration: "none",
                        cursor: "pointer",
                      }}
                    >
                      My Account
                    </Link>
                    <Link
                      to="/"
                      onClick={(e) => {
                        e.preventDefault();
                        this.props.actions.logout();
                      }}
                      style={{
                        color: "#ffffff",
                        textDecoration: "none",
                        cursor: "pointer",
                      }}
                    >
                      Logout
                    </Link>
                  </>
                ) : (
                  <Link
                    to="/login"
                    style={{
                      color: "#ffffff",
                      textDecoration: "none",
                      cursor: "pointer",
                    }}
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
        <Navbar
          expand="lg"
          style={{
            background: "#ffffff",
            borderBottom: "1px solid #e5e7eb",
            padding: "1.5rem 0",
          }}
        >
          <div className="container">
            <div className="d-flex align-items-center w-100">
              <NavbarBrand
                tag={Link}
                to="/"
                onClick={(e) => {
                  e.preventDefault();
                  this.props.actions.changeCategory({});
                  this.props.actions.getProducts();
                  const event = new CustomEvent("goToHomepage", { detail: {} });
                  window.dispatchEvent(event);
                  if (window.location.pathname !== "/") {
                    window.location.href = "/";
                  }
                }}
                style={{
                  color: "#1a1a1a",
                  fontWeight: "300",
                  fontSize: "1.75rem",
                  textDecoration: "none",
                  letterSpacing: "4px",
                  marginRight: "3rem",
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  transition: "opacity 0.2s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => (e.target.style.opacity = "0.7")}
                onMouseLeave={(e) => (e.target.style.opacity = "1")}
              >
                NORTHWIND
              </NavbarBrand>
              <div className="flex-grow-1 d-none d-lg-block">
                <form onSubmit={this.handleSearchSubmit} style={{ maxWidth: "600px", margin: "0 auto" }}>
                  <InputGroup
                    style={{
                      maxWidth: "100%",
                      position: "relative",
                    }}
                  >
                    <Input
                      type="text"
                      placeholder="What can we help you find?"
                      value={this.state.searchTerm}
                      onChange={this.handleSearchChange}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          this.handleSearchSubmit(e);
                        }
                      }}
                      style={{
                        border: "1px solid #e5e7eb",
                        borderRadius: "0",
                        padding: "0.875rem 3.5rem 0.875rem 1.25rem",
                        fontSize: "0.875rem",
                        transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "#1a1a1a";
                        e.target.style.boxShadow = "0 0 0 1px #1a1a1a";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "#e5e7eb";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                    <InputGroupText
                      style={{
                        position: "absolute",
                        right: "0",
                        top: "0",
                        bottom: "0",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        padding: "0.875rem 1rem",
                        zIndex: 10,
                      }}
                      onClick={this.handleSearchSubmit}
                      onMouseEnter={(e) => {
                        const svg = e.currentTarget.querySelector("svg");
                        if (svg) {
                          svg.style.stroke = "#1a1a1a";
                        }
                      }}
                      onMouseLeave={(e) => {
                        const svg = e.currentTarget.querySelector("svg");
                        if (svg) {
                          svg.style.stroke = "#6b7280";
                        }
                      }}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{
                          transition: "stroke 0.2s ease",
                        }}
                      >
                        <path
                          d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z"
                          stroke="#6b7280"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M14 14L11.1 11.1"
                          stroke="#6b7280"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </InputGroupText>
                  </InputGroup>
                </form>
              </div>
              <NavbarToggler
                onClick={this.toggle}
                style={{
                  border: "none",
                  padding: "0.25rem 0.5rem",
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 12H21"
                    stroke="#1a1a1a"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M3 6H21"
                    stroke="#1a1a1a"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M3 18H21"
                    stroke="#1a1a1a"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </NavbarToggler>
              <Collapse isOpen={this.state.isOpen} navbar>
                <Nav className="ms-auto d-flex align-items-center" navbar>
                  {this.props.auth.isAuthenticated &&
                    this.props.auth.user?.role === "admin" && (
                      <>
                        <NavItem className="d-none d-lg-block">
                          <NavLink
                            tag={Link}
                            to="/saveproduct"
                            style={{
                              color: "#1a1a1a",
                              fontWeight: "400",
                              fontSize: "0.875rem",
                              textDecoration: "none",
                              marginRight: "1.5rem",
                              textTransform: "uppercase",
                              letterSpacing: "1px",
                              transition: "opacity 0.2s ease",
                              position: "relative",
                              paddingBottom: "0.25rem",
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.opacity = "0.6";
                              const underline = e.target.querySelector(".nav-underline");
                              if (underline) underline.style.width = "100%";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.opacity = "1";
                              const underline = e.target.querySelector(".nav-underline");
                              if (underline) underline.style.width = "0";
                            }}
                          >
                            Add Product
                            <span
                              className="nav-underline"
                              style={{
                                position: "absolute",
                                bottom: "0",
                                left: "0",
                                height: "1px",
                                width: "0",
                                backgroundColor: "#1a1a1a",
                                transition: "width 0.3s ease",
                              }}
                            />
                          </NavLink>
                        </NavItem>
                        <NavItem className="d-none d-lg-block">
                          <NavLink
                            tag={Link}
                            to="/admin/coupons"
                            style={{
                              color: "#1a1a1a",
                              fontWeight: "400",
                              fontSize: "0.875rem",
                              textDecoration: "none",
                              marginRight: "1.5rem",
                              textTransform: "uppercase",
                              letterSpacing: "1px",
                              transition: "opacity 0.2s ease",
                              position: "relative",
                              paddingBottom: "0.25rem",
                            }}
                            onMouseEnter={(e) => {
                              e.target.style.opacity = "0.6";
                              const underline = e.target.querySelector(".nav-underline");
                              if (underline) underline.style.width = "100%";
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.opacity = "1";
                              const underline = e.target.querySelector(".nav-underline");
                              if (underline) underline.style.width = "0";
                            }}
                          >
                            Coupons
                            <span
                              className="nav-underline"
                              style={{
                                position: "absolute",
                                bottom: "0",
                                left: "0",
                                height: "1px",
                                width: "0",
                                backgroundColor: "#1a1a1a",
                                transition: "width 0.3s ease",
                              }}
                            />
                          </NavLink>
                        </NavItem>
                      </>
                    )}
                  <NavItem>
                    <NavLink
                      tag={Link}
                      to="/favorites"
                      style={{
                        color: "#1a1a1a",
                        fontWeight: "400",
                        fontSize: "0.875rem",
                        textDecoration: "none",
                        marginRight: "1.5rem",
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                        transition: "opacity 0.2s ease",
                        position: "relative",
                        paddingBottom: "0.25rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.opacity = "0.6";
                        const underline = e.target.querySelector(".nav-underline");
                        if (underline) underline.style.width = "100%";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.opacity = "1";
                        const underline = e.target.querySelector(".nav-underline");
                        if (underline) underline.style.width = "0";
                      }}
                    >
                      Favorites
                      {this.props.favorites && this.props.favorites.length > 0 && (
                        <Badge
                          style={{
                            background: "#1a1a1a",
                            color: "white",
                            borderRadius: "50%",
                            width: "18px",
                            height: "18px",
                            fontSize: "0.625rem",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "0",
                          }}
                        >
                          {this.props.favorites.length}
                        </Badge>
                      )}
                      <span
                        className="nav-underline"
                        style={{
                          position: "absolute",
                          bottom: "0",
                          left: "0",
                          height: "1px",
                          width: "0",
                          backgroundColor: "#1a1a1a",
                          transition: "width 0.3s ease",
                        }}
                      />
                    </NavLink>
                  </NavItem>
                  <CartSummary />
                </Nav>
              </Collapse>
            </div>
          </div>
        </Navbar>
        <div
          style={{
            background: "#ffffff",
            borderBottom: "1px solid #e5e7eb",
            padding: "0.75rem 0",
          }}
        >
          <div className="container">
            <div className="d-flex align-items-center gap-4" style={{ flexWrap: "wrap" }}>
              <NavLink
                tag={Link}
                to="/"
                onClick={(e) => this.handleCategoryClick("All", e)}
                style={{
                  color: !this.props.currentCategory.id ? "#1a1a1a" : "#6b7280",
                  fontWeight: !this.props.currentCategory.id ? "500" : "400",
                  fontSize: "0.875rem",
                  textDecoration: "none",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  cursor: "pointer",
                }}
              >
                All
              </NavLink>
              <div className="category-dropdown-container" style={{ position: "relative" }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    this.toggleCategoryDropdown();
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: this.props.currentCategory.id ? "#1a1a1a" : "#6b7280",
                    fontWeight: this.props.currentCategory.id ? "500" : "400",
                    fontSize: "0.875rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    padding: "0",
                    cursor: "pointer",
                  }}
                >
                  Categories
                </button>
                {this.state.categoryDropdownOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: "0",
                      marginTop: "0.5rem",
                      background: "#ffffff",
                      border: "1px solid #e5e7eb",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      minWidth: "600px",
                      maxWidth: "90vw",
                      padding: "1.5rem",
                      zIndex: 1000,
                    }}
                    className="category-dropdown-menu"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {this.props.categories && this.props.categories.length > 0
                      ? this.props.categories.map((category) => (
                        <div
                          key={category.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            this.handleCategoryClick(category.id, e);
                            this.toggleCategoryDropdown();
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.75rem",
                            color:
                              this.props.currentCategory.id === category.id
                                ? "#1a1a1a"
                                : "#6b7280",
                            fontWeight:
                              this.props.currentCategory.id === category.id
                                ? "500"
                                : "400",
                            fontSize: "0.875rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            padding: "0.75rem 1rem",
                            cursor: "pointer",
                            backgroundColor:
                              this.props.currentCategory.id === category.id
                                ? "#f9fafb"
                                : "transparent",
                            borderRadius: "4px",
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            if (this.props.currentCategory.id === category.id) return;
                            e.target.style.backgroundColor = "#f9fafb";
                          }}
                          onMouseLeave={(e) => {
                            if (this.props.currentCategory.id === category.id) return;
                            e.target.style.backgroundColor = "transparent";
                          }}
                        >
                          <span style={{ display: "flex", alignItems: "center", minWidth: "20px" }}>
                            {this.getCategoryIcon(category.categoryName)}
                          </span>
                          {category.categoryName}
                        </div>
                      ))
                      : null}
                  </div>
                )}
              </div>
              <NavLink
                tag={Link}
                to="/"
                onClick={(e) => this.handleCategoryClick("Sale", e)}
                style={{
                  color: "#6b7280",
                  fontWeight: "400",
                  fontSize: "0.875rem",
                  textDecoration: "none",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  cursor: "pointer",
                }}
              >
                Sale
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentCategory: state.changeCategoryReducer,
    categories: state.categoryListReducer,
    favorites: state.favoriteReducer,
    auth: state.authReducer,
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
      checkAuth: bindActionCreators(authActions.checkAuth, dispatch),
      logout: bindActionCreators(authActions.logout, dispatch),
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Navi);

