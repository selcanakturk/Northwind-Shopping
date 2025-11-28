import React, { Component } from "react";
import ProductList from "../products/ProductList.jsx";
import { Row, Col } from "reactstrap";

export default class Dashboard extends Component {
  render() {
    return (
      <div style={{ padding: "2rem 0" }}>
        <Row className="g-4">
          <Col xs="12">
            <ProductList />
          </Col>
        </Row>
      </div>
    );
  }
}

