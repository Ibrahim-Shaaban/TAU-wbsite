import React from "react";

class MedicalAssistantPage extends React.Component {
  componentDidMount() {
    let elem = document.getElementById("Chat");
    console.log("Chat Content", elem.innerHtml);
  }
  render() {
    return <p>MedicalAssistantPage</p>;
  }
}

export default MedicalAssistantPage;
