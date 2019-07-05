import React from "react";
import { connect } from "react-redux";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { changeCurrentPage } from "../actions";

class Header extends React.Component {
  render() {
    return (
      <Navbar
        // bg="dark"
        expand="lg"
        variant="dark"
        style={{ backgroundColor: "#2c3045" }}
      >
        <Navbar.Brand href="#">
          <div
            onClick={e => {
              e.preventDefault();
              // console.log("clicked");
              this.props.changeCurrentPage("home");
            }}
          >
            TAU
          </div>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link>
              <div
                onClick={e => {
                  this.props.changeCurrentPage("home");
                }}
              >
                Home
              </div>
            </Nav.Link>
            <NavDropdown title="Our Services" id="basic-nav-dropdown">
              <NavDropdown.Item>
                <div
                  onClick={e => {
                    this.props.changeCurrentPage("choose");
                  }}
                >
                  Choose Service
                </div>
              </NavDropdown.Item>
              <NavDropdown.Item>
                <div
                  onClick={e => {
                    this.props.changeCurrentPage("medical");
                  }}
                >
                  Medical Assistant
                </div>
              </NavDropdown.Item>
              <NavDropdown.Item>
                <div onClick={() => this.props.changeCurrentPage("chat")}>
                  Chat bot
                </div>
              </NavDropdown.Item>
              <NavDropdown.Item>
                <div onClick={() => this.props.changeCurrentPage("xRay")}>
                  X_Ray
                </div>
              </NavDropdown.Item>
              <NavDropdown.Item>
                <div onClick={() => this.props.changeCurrentPage("skin")}>
                  Skin Cancer
                </div>
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

const mapStateToProps = state => {
  // console.log(state);
  return { currentPage: state.currentPage };
};

export default connect(
  mapStateToProps,
  { changeCurrentPage }
)(Header);
