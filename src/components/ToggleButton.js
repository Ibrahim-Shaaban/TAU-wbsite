import React from "react";
import { Alert, Button } from "react-bootstrap";
// import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { faYoutube, faWikipediaW } from "@fortawesome/free-brands-svg-icons";

class ToggleButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false
    };
  }

  render() {
    const handleDismiss = () => this.setState({ show: false });
    const handleShow = () => this.setState({ show: true });
    if (this.state.show) {
      return (
        <Alert variant="dark" onClose={handleDismiss} dismissible>
          {/* <Alert.Heading>Oh snap! You got an error!</Alert.Heading> */}
          <p style={{ fontSize: "15px" }}>{this.props.text}</p>
          <div>
            <Button
              style={{ marginLeft: 5, marginRight: 5 }}
              variant="danger"
              onClick={() => {
                window.open(this.props.youtubeUrl, "_blank");
              }}
            >
              <FontAwesomeIcon icon={faYoutube} size="lg" />
            </Button>

            <Button
              variant="light"
              onClick={() => {
                window.open(this.props.wikiUrl, "_blank");
              }}
            >
              <FontAwesomeIcon icon={faWikipediaW} size="lg" />
            </Button>
          </div>
        </Alert>
      );
    }
    return (
      <Button onClick={handleShow} size="sm">
        Show Definition and references
      </Button>
    );
  }
}

export default ToggleButton;
