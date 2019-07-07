import React from "react";
import { Row, Col } from "react-bootstrap";
// import StickyFooter from "react-sticky-footer";

class Footer extends React.Component {
  render() {
    return (
      <div
        style={{
          backgroundColor: "rgb(44, 48, 69)",
          color: "white",
          width: "100%",

          position: "absolute",

          bottom: 0,

          height: "2.5rem"
        }}
      >
        <Col md="12">
          <Row>
            <Col md="4">content here</Col>
            <Col md="4">content here</Col>
            <Col md="4">content here</Col>
          </Row>
        </Col>
      </div>
    );
  }
}

export default Footer;
