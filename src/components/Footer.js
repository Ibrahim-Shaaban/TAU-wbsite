import React from "react";
import { Row, Col } from "react-bootstrap";
// import StickyFooter from "react-sticky-footer";
import icon from "../images/icon.png";

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
            <Col md="4" className="text-right">
              <img
                src={icon}
                width="45"
                height="45"
                className="d-inline-block align-top"
                alt="React Bootstrap logo"
              />
            </Col>
            <Col md="4" className="text-center mt-auto">
              <h5>all copyrights to our team @2019</h5>
            </Col>
            <Col md="4" className="text-left">
              <img
                src={icon}
                width="45"
                height="45"
                className="d-inline-block align-top"
                alt="React Bootstrap logo"
              />
            </Col>
          </Row>
        </Col>
      </div>
    );
  }
}

export default Footer;
