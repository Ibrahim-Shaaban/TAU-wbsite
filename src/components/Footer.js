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

          height: "3rem"
        }}
      >
        <Col md="12">
          <Row>
            <Col md="12" className="text-center">
              <h5>all copyrights to our team (TAU TEAM) </h5>
            </Col>
          </Row>
        </Col>
      </div>
    );
  }
}

export default Footer;
