import React from "react";
import Recorder from "recorder-js";
import { Button, Row, Col, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faMicrophoneSlash
} from "@fortawesome/free-solid-svg-icons";
import Loading from "./Loading";
import { textToSpeechUrl, speechToTextUrl, chatBotUrl } from "../api/localhost";
import robotImg from "../images/robot2.png";
// import "./ChatPage.css";

class ChatPage extends React.Component {
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
      chatSound: "",
      chatState: false, // for loading
      currentClinetInedx: 0,
      currentChatIndex: 1,
      allChatArray: [],
      canStartButton: true
    };
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)({
      sampleRate: 16000
    });

    this.recorder = new Recorder(
      this.audioContext,
      {},
      {
        onAnalysed: data => this.setState({ analyserData: data })
      }
    );
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(stream => {
        this.setState({ stream });
        this.recorder.init(stream);
      })
      .catch(this.dontGotStream);
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
        chatSpeech: "",
        chatSound: "",
        chatState: false, // for loading ,,
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
      const { allChatArray, clientSpeech } = this.state;
      allChatArray.push({
        clientSpeechLoading: true,
        clientSpeech,
        type: "client"
      });
      this.setState({
        allChatArray,
        isRecording: false,
        blob,
        clientSpeechLoading: true
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

            const {
              allChatArray,
              currentClinetInedx,
              chatSound,
              chatSpeech
            } = this.state;
            allChatArray[currentClinetInedx] = {
              clientSpeechLoading: false,
              clientSpeech: res.text,
              type: "client"
            };
            allChatArray.push({
              chatState: "loading",
              chatSound,
              chatSpeech,
              type: "chat"
            });
            this.setState({
              allChatArray,
              clientSpeech: res.text,
              chatState: "loading",
              clientSpeechLoading: false
            });

            //call chatbot api
            fetch(chatBotUrl, {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
              },
              method: "POST",
              body: JSON.stringify({ text: res.text })
            })
              .then(res => res.json())
              .then(res => {
                console.log(res);
                // const result =
                //   res.results[0].lexicalEntries[0].entries[0].senses[0]
                //     .definitions[0];
                // start
                const result = res.data;
                console.log("chatbot result :", result);

                this.setState({ chatSpeech: result });
                let data = { text: result };
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
                    const {
                      chatSpeech,
                      allChatArray,
                      currentClinetInedx,
                      currentChatIndex
                    } = this.state;
                    allChatArray[currentChatIndex] = {
                      chatState: true,
                      chatSound: res.data,
                      chatSpeech,
                      type: "chat"
                    };
                    this.setState({
                      allChatArray,
                      chatState: true,
                      chatSound: res.data,
                      currentClinetInedx: currentClinetInedx + 2,
                      currentChatIndex: currentChatIndex + 2,
                      canStartButton: true
                    });

                    this.sound("data:audio/wav;base64," + res.data);
                  });
              })
              .catch(err => {
                // error from chatbot api
                const errorMessage =
                  "sorry , i can't understand . please try again ";
                this.setState({
                  chatSpeech: errorMessage
                });
                let data = {
                  text: errorMessage
                };
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
                    const {
                      chatSpeech,
                      allChatArray,
                      currentClinetInedx,
                      currentChatIndex
                    } = this.state;
                    allChatArray[currentChatIndex] = {
                      chatState: true,
                      chatSound: res.data,
                      chatSpeech,
                      type: "chat"
                    };
                    this.setState({
                      allChatArray,
                      chatState: true,
                      chatSound: res.data,
                      currentClinetInedx: currentClinetInedx + 2,
                      currentChatIndex: currentChatIndex + 2,
                      canStartButton: true
                    });
                    this.sound("data:audio/wav;base64," + res.data);
                  });
              });
            //end
          }
          if (res.error === "1") {
            // error in speech to text api
            // console.log("please try again");
            const { allChatArray, currentClinetInedx } = this.state;
            allChatArray.splice(currentClinetInedx, 1);
            this.setState({ allChatArray, canStartButton: true });
          }
        });
    });
  };

  dontGotStream = error => {
    console.log("Get stream failed", error);
  };

  handleView = () => {
    const { allChatArray } = this.state;
    const view = allChatArray.map((obj, index) => {
      if (obj.type === "client") {
        if (obj.clientSpeechLoading) {
          return (
            <Alert
              key={`${index}`}
              variant="dark"
              style={{ padding: 3, marginTop: 5, marginBottom: 5 }}
            >
              <Row>
                <Col md="2">
                  <h4>You :</h4>
                </Col>
                <Col md="10" style={{ marginTop: 5, marginLeft: "-60px" }}>
                  <Loading />
                </Col>
              </Row>
            </Alert>
          );
        }
        if (obj.clientSpeech) {
          // return <div>{`You : ${obj.clientSpeech}`}</div>;
          return (
            <Alert
              key={`${index}-`}
              variant="dark"
              style={{ padding: 3, marginTop: 5, marginBottom: 5 }}
            >
              <Row>
                <Col md="2">
                  <h4>You :</h4>
                </Col>
                <Col md="10" style={{ marginLeft: "-60px", marginTop: 5 }}>
                  {obj.clientSpeech}
                </Col>
              </Row>
            </Alert>
          );
        }
      }
      if (obj.type === "chat") {
        if (obj.chatState === "loading") {
          return (
            <Alert key={`${index}`} variant="success" style={{ padding: 3 }}>
              <Row>
                <Col md="2">
                  <h4>TAU :</h4>
                </Col>
                <Col md="10" style={{ marginTop: 5, marginLeft: "-55px" }}>
                  <Loading />
                </Col>
              </Row>
            </Alert>
          );
        }
        if (obj.chatSpeech && obj.chatState) {
          return (
            <Alert key={`${index}-`} variant="success" style={{ padding: 3 }}>
              <Row>
                <Col md="2">
                  <h4>TAU :</h4>
                </Col>
                <Col md="10" style={{ marginLeft: "-55px", marginTop: 3 }}>
                  {obj.chatSpeech}
                  <Button
                    style={{ marginLeft: 10 }}
                    variant="success"
                    size="sm"
                    onClick={() => {
                      this.sound("data:audio/wav;base64," + obj.chatSound);
                    }}
                  >
                    hear again
                  </Button>
                </Col>
              </Row>
            </Alert>
          );
        }
      }
    });
    return view;
  };

  render() {
    const { isRecording, canStartButton } = this.state;

    // console.log(allChatArray);
    return (
      <Row style={{ marginTop: 5, overflow: "hidden" }}>
        <Col md="2">
          <img src={robotImg} style={{ width: "100%" }} />
        </Col>
        <Col md="8">
          <div className="text-center">
            {!isRecording ? (
              <Button
                disabled={!canStartButton}
                variant="primary"
                onClick={this.start}
              >
                start <FontAwesomeIcon icon={faMicrophone} size="lg" />
              </Button>
            ) : (
              <Button variant="secondary" onClick={this.stop}>
                stop <FontAwesomeIcon icon={faMicrophoneSlash} size="lg" />
              </Button>
            )}
          </div>
          {/* <div>{this.clientSpeech()}</div>
        <div>{this.chatSpeech()}</div> */}
          <div
            id="view"
            style={{
              overflowY: "auto",
              overflowX: "hidden",
              height: "400px",
              width: "100%",
              paddingRight: "28px"
            }}
          >
            {this.handleView()}
          </div>
        </Col>
        <Col md="2">
          <img src={robotImg} style={{ width: "100%" }} />
        </Col>
      </Row>
    );
  }
}

export default ChatPage;
