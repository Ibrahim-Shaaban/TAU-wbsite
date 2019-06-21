import React from "react";
import { connect } from "react-redux";
import { Container } from "react-bootstrap";
import HomePage from "./HomePage";
import Header from "./Header";
import MedicalAssistantPage from "./MedicalAssistantPage";
import ChatPage from "./ChatPage";
import XRayPage from "./XRayPage";
import SkinCancerPage from "./SkinCancerPage";

class App extends React.Component {
  renderPage = () => {
    const { currentPage } = this.props;
    switch (currentPage) {
      case "home":
        return <HomePage />;
      case "medical":
        return <MedicalAssistantPage />;
      case "chat":
        return <ChatPage />;
      case "xRay":
        return <XRayPage />;
      case "skin":
        return <SkinCancerPage />;
      default:
        console.log("default");
    }
  };

  render() {
    return (
      <div>
        <Header />
        <Container>{this.renderPage()}</Container>
      </div>
    );
  }
}

const mapStateToProps = state => {
  // console.log(state);
  return state;
};

export default connect(mapStateToProps)(App);
