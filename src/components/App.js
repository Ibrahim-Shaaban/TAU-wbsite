import React from "react";
import { connect } from "react-redux";
import { Container } from "react-bootstrap";
import HomePage from "./HomePage";
import Header from "./Header";
import MedicalAssistantPage from "./MedicalAssistantPage";
import ChatPage from "./ChatPage";
import XRayPage from "./XRayPage";
import SkinCancerPage from "./SkinCancerPage";
import ImageForm from "./ImageForm";
import Footer from "./Footer";

class App extends React.Component {
  renderPage = () => {
    const { currentPage } = this.props;
    switch (currentPage) {
      case "home":
        return <HomePage currentPage={currentPage} />;
      case "medical":
        return <MedicalAssistantPage />;
      case "chat":
        return <ChatPage />;
      case "xRay":
        return <ImageForm endpoint="xray" />;
      // return <XRayPage />;
      case "skin":
        return <ImageForm endpoint="skin" />;
      // return <SkinCancerPage />;
      default:
        console.log("default");
    }
  };

  render() {
    return (
      <div>
        <Header />
        <Container>{this.renderPage()}</Container>
        <Footer>
          <a href="#">Lol</a>
          <a href="#">Heheh</a>
          <a href="#">blah blah</a>
        </Footer>
      </div>
    );
  }
}

const mapStateToProps = state => {
  // console.log(state);
  return state;
};

export default connect(mapStateToProps)(App);
