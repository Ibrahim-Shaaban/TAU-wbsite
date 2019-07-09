import React from "react";
import { Card, Button, Col, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faGithub,
  faLinkedin
} from "@fortawesome/free-brands-svg-icons";

class InformationCard extends React.Component {
  render() {
    const {
      imgUrl,
      name,
      jobTitle,
      facebookUrl,
      twitterUrl,
      githubUrl,
      linkedinUrl
    } = this.props.info;
    return (
      <div>
        {" "}
        <Card text="white" style={{ backgroundColor: "#303758" }}>
          <Card.Img
            variant="top"
            src={imgUrl}
            style={{ maxWidth: "100%", height: "200px" }}
          />
          <Card.Body>
            <Card.Title className="text-center">{name}</Card.Title>
            <Card.Text className="text-center">{jobTitle}</Card.Text>
            <Row style={{ marginLeft: "-25px" }}>
              <Col md="3">
                <Button
                  variant="primary"
                  onClick={() => {
                    window.open(facebookUrl, "_blank");
                  }}
                >
                  <FontAwesomeIcon icon={faFacebook} size="lg" />
                </Button>
              </Col>
              <Col md="3">
                <Button
                  variant="info"
                  onClick={() => {
                    window.open(twitterUrl, "_blank");
                  }}
                >
                  <FontAwesomeIcon icon={faTwitter} size="lg" />
                </Button>
              </Col>

              <Col md="3">
                <Button
                  variant="light"
                  onClick={() => {
                    window.open(githubUrl, "_blank");
                  }}
                >
                  <FontAwesomeIcon icon={faGithub} size="lg" />
                </Button>
              </Col>

              <Col md="3">
                <Button
                  variant="primary"
                  onClick={() => {
                    window.open(linkedinUrl, "_blank");
                  }}
                >
                  <FontAwesomeIcon icon={faLinkedin} size="lg" />
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </div>
    );
  }
}

export default InformationCard;
