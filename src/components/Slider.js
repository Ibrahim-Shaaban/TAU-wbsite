import React from "react";
import { Carousel } from "react-bootstrap";
import medicalAssistantImage from "../slider/medical_assistant.jpg";
import chatbotImage from "../slider/chatbot.jpg";
import visionImage from "../slider/vision.jpg";

class Slider extends React.Component {
  render() {
    return (
      <div>
        <Carousel>
          <Carousel.Item>
            <img
              style={{ width: "100%", height: "400px" }}
              src={medicalAssistantImage}
              alt="First slide"
            />
            <Carousel.Caption>
              <h3 style={{ color: "rgb(44, 48, 69)" }}>Medical Assistant</h3>
              <p>
                Symptoms checker to ask the client what he feels then show the
                result
              </p>
            </Carousel.Caption>
          </Carousel.Item>

          <Carousel.Item>
            <img
              style={{ width: "100%", height: "400px" }}
              src={chatbotImage}
              alt="First slide"
            />
            <Carousel.Caption>
              <h3 style={{ color: "rgb(44, 48, 69)" }}>ChatBot</h3>
              <p>Make a convrsation with our chatbot</p>
            </Carousel.Caption>
          </Carousel.Item>

          <Carousel.Item>
            <img
              style={{ width: "100%", height: "400px" }}
              src={visionImage}
              alt="First slide"
            />
            <Carousel.Caption>
              <h3 style={{ color: "rgb(41, 42, 46)" }}>
                Chest X-Ray And Skin Cancer detection
              </h3>
              <p>Detection of disaese from x-ray image or skin image</p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </div>
    );
  }
}

export default Slider;
