import React from "react";
import Recorder from "recorder-js";
import { Howl, Howler } from "howler";
import { Button, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faMicrophoneSlash
} from "@fortawesome/free-solid-svg-icons";
// import { changeCurrentPage } from "../actions";
import Loading from "./Loading";
import { textToSpeechUrl, speechToTextUrl } from "../api/localhost";

class MedicalQuestions extends React.Component {
  constructor() {
    super();
    this.state = {
      blob: null,
      isRecording: false,
      stream: null,
      analyserData: { data: [], lineTo: 0 },
      clientSpeech: "",
      clientSpeechLoading: false,
      chatSpeech: "",
      chatSpeechArray: [],
      chatSound: "",
      chatSoundArray: [],
      chatLoading: false, // for loading
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

  dontGotStream = error => {
    console.log("Get stream failed", error);
  };

  start = () => {
    this.recorder.start().then(() =>
      this.setState({
        isRecording: true,
        blob: null,
        stream: null,
        analyserData: { data: [], lineTo: 0 },
        clientSpeech: "",
        clientSpeechLoading: false,
        canStartButton: false,
        chatSpeech: "",
        chatSound: "",
        chatSpeechArray: [],
        chatSoundArray: []
      })
    );
  };

  playSound = (currentIndex, srcArray) => {
    if (currentIndex === srcArray.length) {
      console.log("array : ", srcArray);

      return "done";
    }

    // Setup the new Howl.
    var sound = new Howl({
      src: "data:audio/wav;base64," + srcArray[currentIndex].data
    });

    sound.play();
    console.log("index : ", srcArray[currentIndex]);
    console.log("currentIndex : ", currentIndex);

    sound.on("end", () => {
      this.playSound(currentIndex + 1, srcArray);
    });
  };

  splitResponse = (response, length) => {
    let splittedResponse = response.split(" ");
    let responseArray = [];
    let sentence = "";
    splittedResponse.forEach((word, index) => {
      sentence = `${sentence} ${word}`;

      if (
        (index % length === 0 && index !== 0) ||
        index === splittedResponse.length - 1
      ) {
        responseArray.push(sentence);
        sentence = "";
      }
    });

    return responseArray;
  };

  stop = () => {
    this.recorder.stop().then(({ blob }) => {
      this.setState({
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
            console.log("client said : ", res);
            this.setState({
              clientSpeech: res.text,
              clientSpeechLoading: false,
              chatLoading: true
            });

            // call entity api to get answer of question
            let response =
              "Cells are the basic units that make up the human body. Cells grow and divide to make new cells as the body needs them. Usually, cells die when they get too old or damaged. Then, new cells take their place.Cancer begins when genetic changes interfere with this orderly process. Cells start to grow uncontrollably. These cells may form a mass called a tumor. A tumor can be cancerous or benign. A cancerous tumor is malignant, meaning it can grow and spread to other parts of the body. A benign tumor means the tumor can grow but will not spread. Some types of cancer do not form a tumor. These include leukemias, most types of lymphoma, and myeloma.";
            // let response = "hello from the other world";
            let splittedResponse = this.splitResponse(response, 15);
            this.setState({
              chatSpeech: response,
              chatSpeechArray: splittedResponse
            });
            // loop for splitted response to fetch sound of each them
            splittedResponse.forEach((response, index) => {
              let data = { text: response, index };
              console.log(data);
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
                  const { chatSoundArray } = this.state;
                  chatSoundArray.push({
                    data: res.data,
                    index: res.index === undefined ? 0 : res.index
                  });
                  // this.sound("data:audio/wav;base64," + res.data);
                  if (chatSoundArray.length === splittedResponse.length) {
                    this.setState({
                      chatLoading: false,
                      chatSoundArray: chatSoundArray.sort((a, b) =>
                        a.index > b.index ? 1 : b.index > a.index ? -1 : 0
                      )
                    });
                  } else {
                    this.setState({
                      chatSoundArray
                    });
                  }
                  // this.sound("data:audio/wav;base64," + res.data);
                });
            });
          }
          if (res.error === "1") {
            // error from speech to text api
            console.log("please try again");
            alert("sorry please try again");
            this.setState({ clientSpeechLoading: false, canStartButton: true });
          }
        });
    });
  };

  handleAnswerView = () => {
    const {
      chatLoading,
      chatSpeech,
      chatSoundArray,
      chatSpeechArray
    } = this.state;
    if (chatLoading) {
      return <Loading size="large" />;
    }

    if (chatSoundArray.length === chatSpeechArray.length && chatSpeech) {
      return (
        <div style={{ color: "white" }}>
          <h4>
            {chatSpeech}{" "}
            <Button
              style={{ marginLeft: 7 }}
              variant="success"
              size="sm"
              onClick={() => {
                // console.log(chatSound);
                // let finalSound = chatSound.join();
                this.playSound(
                  0,
                  chatSoundArray.sort((a, b) =>
                    a.index > b.index ? 1 : b.index > a.index ? -1 : 0
                  )
                );
              }}
            >
              hear again
            </Button>
          </h4>
        </div>
      );
    }
  };

  handelClientSpeech = () => {
    const { clientSpeech, clientSpeechLoading } = this.state;
    if (clientSpeechLoading) {
      return <Loading size="large" />;
    }
    if (clientSpeech) {
      return (
        <div>
          <h4>
            <span
              style={{
                color: "#1086ff",
                fontWeight: "bold",
                fontStyle: "italic",
                fontSize: "30px"
              }}
            >
              {clientSpeech} ?
            </span>
            ?
          </h4>
        </div>
      );
    }
  };
  render() {
    const {
      isRecording,
      canStartButton
      // clientSpeechLoading,
      // clientSpeech
    } = this.state;
    return (
      <Row style={{ marginTop: 5 }}>
        <Col md="12">
          <div className="text-center">
            {!isRecording ? (
              <Button
                disabled={!canStartButton}
                variant="primary"
                onClick={this.start}
              >
                Ask a question <FontAwesomeIcon icon={faMicrophone} size="lg" />
              </Button>
            ) : (
              <Button variant="secondary" onClick={this.stop}>
                stop <FontAwesomeIcon icon={faMicrophoneSlash} size="lg" />
              </Button>
            )}
          </div>

          <Col style={{ marginTop: 10 }} className="text-center">
            {this.handelClientSpeech()}
          </Col>
          <Col style={{ marginTop: 10 }} className="text-center">
            {this.handleAnswerView()}
          </Col>
        </Col>
      </Row>
    );
  }
}

export default MedicalQuestions;
