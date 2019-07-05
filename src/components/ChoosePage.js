import React from "react";
import { connect } from "react-redux";
import Recorder from "recorder-js";
import { Button, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faMicrophoneSlash
} from "@fortawesome/free-solid-svg-icons";
import { changeCurrentPage } from "../actions";
import Loading from "./Loading";
import { textToSpeechUrl, speechToTextUrl } from "../api/localhost";

class ChoosePage extends React.Component {
  constructor() {
    super();
    this.state = {
      blob: null,
      isRecording: false,
      stream: null,
      analyserData: { data: [], lineTo: 0 },
      clientSpeech: "",
      clientSpeechLoading: false,
      canListenToAnswer: false,
      chatSpeech: "Please choose cahtbot page or medical assistant page",
      chatSound: "",
      chatLoading: true, // for loading
      canStartButton: true
    };
    this.audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();

    this.recorder = new Recorder(this.audioContext, {
      onAnalysed: data => this.setState({ analyserData: data })
    });
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(stream => {
        this.setState({ stream });
        this.recorder.init(stream);
      })
      .catch(this.dontGotStream);
  }

  componentDidMount() {
    let data = { text: this.state.chatSpeech };
    // call text-to-speech api
    fetch(textToSpeechUrl, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(res => {
        this.setState({
          chatLoading: false,
          chatSound: res.data,
          canListenToAnswer: true
        });
        this.sound("data:audio/wav;base64," + res.data);
      });
  }

  start = () => {
    this.recorder.start().then(() =>
      this.setState({
        isRecording: true,
        blob: null,
        stream: null,
        analyserData: { data: [], lineTo: 0 },
        clientSpeech: "",
        clientSpeechLoading: false,
        // chatSpeech: "",
        // chatSound: "",
        // chatState: false, // for loading ,,
        canStartButton: false
      })
    );
  };

  sound = (() => {
    var df = document.createDocumentFragment();
    return function sound(src) {
      var snd = new Audio(src);
      df.appendChild(snd); // keep in fragment until finished playing
      snd.addEventListener("ended", function() {
        df.removeChild(snd);
      });
      snd.play();
      return snd;
    };
  })();

  stop = () => {
    this.recorder.stop().then(({ blob }) => {
      // const { allChatArray } = this.state;

      this.setState({
        // allChatArray,
        isRecording: false,
        blob,
        clientSpeechLoading: true,
        canStartButton: true
      });

      let fd = new FormData();
      fd.append("fname", "sound_file");
      fd.append("data", blob);
      // call speech-to-text api
      fetch(speechToTextUrl, {
        method: "PUT",
        body: fd
      })
        .then(res => res.json())
        .then(res => {
          if (res.error === "0") {
            console.log("client said : ", res.text);
            this.setState({
              clientSpeech: res.text,
              clientSpeechLoading: false
            });
            if (res.text === "chatbot") {
              console.log("chat bot page");
              this.props.changeCurrentPage("chat");
            } else if (res.text === "medical assistant") {
              console.log("medical assistant page");
              this.props.changeCurrentPage("medical");
            } else {
              alert("please try again");
            }
          }
          if (res.error === "1") {
            // error in speech to text api
            console.log("please try again");
            alert("sorry please try again");
            this.setState({ clientSpeechLoading: false });

            this.setState({ canStartButton: true });
          }
        });
    });
  };

  handleQuestionView = () => {
    const {
      chatLoading,
      chatSound,
      chatSpeech,
      // canListenToAnswer,
      canStartButton,
      isRecording
    } = this.state;
    if (chatLoading) {
      return <Loading size="large" />;
    }

    if (chatSound && chatSpeech) {
      return (
        <div style={{ color: "white" }}>
          <h4>
            {chatSpeech}{" "}
            <Button
              style={{ marginLeft: 7 }}
              variant="success"
              size="sm"
              onClick={() => {
                this.sound("data:audio/wav;base64," + chatSound);
              }}
            >
              hear again
            </Button>
          </h4>

          <div className="text-center" style={{ marginTop: 7 }}>
            {!isRecording ? (
              <Button
                disabled={!canStartButton}
                variant="primary"
                onClick={this.start}
              >
                Say chatbot or medical assistant{" "}
                <FontAwesomeIcon icon={faMicrophone} size="lg" />
              </Button>
            ) : (
              <Button variant="primary" onClick={this.stop}>
                stop <FontAwesomeIcon icon={faMicrophoneSlash} size="lg" />
              </Button>
            )}
          </div>
        </div>
      );
    }
  };

  handleClientAnswer = () => {
    const { clientSpeechLoading } = this.state;

    if (clientSpeechLoading) {
      return <Loading size="large" />;
    }
  };

  render() {
    return (
      <Row>
        <Col style={{ marginTop: 10 }} md="12">
          <div className="text-center">{this.handleQuestionView()}</div>
        </Col>
        <Col style={{ marginTop: 10 }}>
          <div className="text-center">{this.handleClientAnswer()}</div>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = state => {
  // console.log(state);
  return state;
};

export default connect(
  mapStateToProps,
  { changeCurrentPage }
)(ChoosePage);
