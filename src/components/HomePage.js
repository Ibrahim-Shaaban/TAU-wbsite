import React from "react";
import DispalyCard from "./DispalyCard";
import { CardDeck, Row, Container } from "react-bootstrap";
// import CardBoot from "./Card

class HomePage extends React.Component {
  render() {
    const medicalPageData = {
      page: "medical",
      title: "Medical Assistant ",
      image: "https://certifiedsource.com/wp-content/uploads/2018/06/ME1.jpg",
      text: [
        "This service represents a questioning system that ask client about what he feels of symptoms to come up with a simple diagnosis of his condition by giving some probabilities of him having some specific diseases and that is achieved by First, the client specify the body region that his symptoms occur mostly Next, the system starts to ask him specific questions about that region where the client answer by confirming having the symptoms or declining having them Finally, after several questions the system displays a list of diseases that the client may have with some probability."
      ]
    };
    const xrayPageData = {
      page: "xRay",
      title: "Chest X-Ray Image Diagnosis ",
      image:
        "https://xranm.com/wp-content/uploads/2014/08/doc-holding-xray-2.jpg",
      text: [
        "This service represents an elementary diagnosis of a patient's Chest X-Ray medical imaging where he interacts with the page through a form which consists of two buttons one to upload a photo describes his X-Ray imaging and the other is to submit it to be analysed noindent A modest analysis is displayed to the client describing the diagnosis of his chest X-Ray imaging and some information about the disease related to it for example: pneumonia or pneumothorax."
      ]
    };
    const chatPageData = {
      page: "chat",
      title: "Chat with Baymax ^_^ ",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXNEjtdVptPJ2-Da34VAnt5LVsVGxQVVMDgf_KNVFZmHW16-X_",
      text: [
        "This service represents an AI agent that the client can talk to and make a conversation with it and that is achieved through First, pressing a button to request a voice record Next, using client's microphone to record voice Then, pressing button to stop recording After That, the page displays text that represents what was spoken inside that recording Finally, chat bot model's reply in text is shown to the client and he can hear it too."
      ]
    };
    const skinPageData = {
      page: "skin",
      title: "Skin Cancer Image Diagnosis ",
      image:
        "https://news-media.stanford.edu/wp-content/uploads/2017/01/24124237/dermatology_sub.jpg",
      text: [
        "This service too represents an elementary diagnosis of a patient's Skin cancer status if existed where he interacts with the page through a form which consists of two buttons one to upload a photo describes his skin condition in some area and the other is to submit it to be analysed. A modest analysis is displayed to the client describing the diagnosis of his skin cancer status and some information about the type of skin cancer he have for example: Nevus or Melanoma or Seborrheic Keratoses."
      ]
    };

    return (
      <Row className="m-4">
        <DispalyCard reverse={false} data={medicalPageData} />
        <DispalyCard reverse={true} data={chatPageData} />
        <DispalyCard reverse={false} data={xrayPageData} />
        <DispalyCard reverse={true} data={skinPageData} />
      </Row>
      // <Row className="m-4">
      //   <CardBoot data={medicalPageData} />
      //   <CardBoot data={chatPageData} />
      //   <CardBoot data={xrayPageData} />
      //   <CardBoot data={skinPageData} />
      // </Row>
    );
  }
}

export default HomePage;
