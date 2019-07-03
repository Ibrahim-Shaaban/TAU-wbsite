import React from "react";
import Recorder from "recorder-js";
import { Button, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faMicrophoneSlash
} from "@fortawesome/free-solid-svg-icons";
import Loading from "./Loading";

import bodyImage from "../images/body.jpg";

class MedicalAssistantPage extends React.Component {
  constructor() {
    super();
    this.state = {
      blob: null,
      isRecording: false,
      isRecordingAnswer: false,
      stream: null,
      analyserData: { data: [], lineTo: 0 },
      clientSpeech: "",
      clientSpeechLoading: false,
      canStartButton: true,
      canStartAnswerButton: true,
      questions: [],
      currentQuestionIndex: 0,
      answers: [],
      questionLoading: false,
      questionSound: "",
      viewQuestions: false,
      endOfQuestions: false,
      finalResult: "",
      finalResultSound: ""
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
  // when client click on start button to start recording
  start = () => {
    this.recorder.start().then(() =>
      this.setState({
        // // isRecording: true,
        // blob: null,
        // stream: null,
        // analyserData: { data: [], lineTo: 0 },
        // clientSpeech: "",
        // clientSpeechLoading: false,
        // chatSpeech: "",
        // chatSound: "",
        // chatState: false, // for loading ,,
        // canStartButton: false,
        // viewQuestions: false ,
        //
        blob: null,
        isRecording: true,
        isRecordingAnswer: false,
        stream: null,
        analyserData: { data: [], lineTo: 0 },
        clientSpeech: "",
        clientSpeechLoading: false,
        canStartButton: true,
        canStartAnswerButton: true,
        questions: [],
        currentQuestionIndex: 0,
        answers: [],
        questionLoading: false,
        questionSound: "",
        viewQuestions: false,
        endOfQuestions: false,
        finalResult: "",
        finalResultSound: ""
      })
    );
  };
  // when client start recording to answer question
  startAnswerQuestion = () => {
    this.recorder.start().then(() =>
      this.setState({
        isRecordingAnswer: true,
        blob: null,
        stream: null,
        analyserData: { data: [], lineTo: 0 },
        canStartAnswerButton: true
      })
    );
  };
  // when client stop recording to answer question
  stopAnswerQuestion = () => {
    this.recorder.stop().then(({ blob }) => {
      // const { allChatArray, clientSpeech } = this.state;

      this.setState({
        isRecordingAnswer: false,
        blob,
        questionLoading: true
      });

      let fd = new FormData();
      fd.append("fname", "sound_file");
      fd.append("data", blob);
      // call speech-to-text api
      fetch("http://127.0.0.1:9000/api/record", {
        method: "PUT",
        body: fd
      })
        .then(res => res.json())
        .then(res => {
          if (res.error === "0") {
            console.log("client said : ", res.text);
            if (res.text === "yes") {
              const { currentQuestionIndex, answers } = this.state;
              answers.push(1);
              this.setState(
                {
                  canStartAnswerButton: false,
                  answers,
                  currentQuestionIndex: currentQuestionIndex + 1
                },
                () => {
                  this.handleQuestionsAnswering();
                }
              );
            }
            if (res.text === "no") {
              const { currentQuestionIndex, answers } = this.state;
              answers.push(0);
              this.setState(
                {
                  canStartAnswerButton: false,
                  answers,
                  currentQuestionIndex: currentQuestionIndex + 1
                },
                () => {
                  this.handleQuestionsAnswering();
                }
              );
            }
          }
          if (res.error === "1") {
            // error in speech to text api
            console.log("please try again");
            alert("sorry please try again");

            const { currentQuestionIndex, answers } = this.state;
            answers.push(0);
            this.setState(
              {
                canStartAnswerButton: false,
                answers,
                currentQuestionIndex: currentQuestionIndex + 1
              },
              () => {
                this.handleQuestionsAnswering();
              }
            );
          }
        });
    });
  };
  // client stop recording his part of body
  stop = () => {
    this.recorder.stop().then(({ blob }) => {
      // const { allChatArray } = this.state;

      this.setState({
        // allChatArray,
        isRecording: false,
        blob,
        clientSpeechLoading: true
      });

      let fd = new FormData();
      fd.append("fname", "sound_file");
      fd.append("data", blob);
      // call speech-to-text api
      fetch("http://127.0.0.1:9000/api/record", {
        method: "PUT",
        body: fd
      })
        .then(res => res.json())
        .then(res => {
          if (res.error === "0") {
            console.log("client said : ", res.text);
            this.setState({
              clientSpeechLoading: false,
              clientSpeech: res.text,
              canStartButton: true
            });
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
  // client said yes to his part of body
  confirmClientCheck = () => {
    // client said yes
    console.log("client said yes");
    // call api to fetch questions from the part chosen by client
    let res = [
      "Do you feel hard ? ",
      "Do you feel slow ? ",
      "Do you feel fast ? "
    ];
    this.setState(
      {
        questions: res,
        clientSpeech: "",
        questionLoading: true,
        viewQuestions: true
      },
      () => {
        this.handleQuestionsAnswering();
      }
    );

    // this.handleQuestionsAnswering();
  };
  // client choose no to his part of body
  cancelClientCheck = () => {
    // client said no
    console.log("client said no ");
    this.setState({
      blob: null,
      isRecording: true,
      isRecordingAnswer: false,
      stream: null,
      analyserData: { data: [], lineTo: 0 },
      clientSpeech: "",
      clientSpeechLoading: false,
      canStartButton: true,
      canStartAnswerButton: true,
      questions: [],
      currentQuestionIndex: 0,
      answers: [],
      questionLoading: false,
      questionSound: "",
      viewQuestions: false,
      endOfQuestions: false,
      finalResult: "",
      finalResultSound: ""
    });
  };

  handelClientSpeech = () => {
    const { clientSpeech, clientSpeechLoading } = this.state;
    if (clientSpeechLoading) {
      return <Loading />;
    }
    if (clientSpeech) {
      return (
        <div>
          <h4>
            Did you mean{" "}
            <span
              style={{
                color: "blue",
                fontWeight: "#3420d7",
                fontStyle: "italic"
              }}
            >
              {clientSpeech}
            </span>{" "}
            ?
          </h4>
          <Button onClick={() => this.confirmClientCheck()}>Yes</Button>
          <Button
            onClick={() => this.cancelClientCheck()}
            style={{ marginLeft: 10 }}
          >
            No
          </Button>
        </div>
      );
    }
  };
  // find next question to display to user
  handleQuestionsAnswering = () => {
    console.log("in handleQuestionsAnswering ");

    const { questions, currentQuestionIndex, endOfQuestions } = this.state;
    // console.log(questions);
    if (questions.length && questions.length !== currentQuestionIndex) {
      let currentQuestion = questions[currentQuestionIndex];
      // this.setState({ questionLoading: true });
      console.log(currentQuestion);
      // call text to speech api
      let data = { text: currentQuestion };
      // call text-to-speech api
      fetch("http://127.0.0.1:8000/api/speech", {
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
            questionLoading: false,
            questionSound: res.data,
            canStartAnswerButton: true
          });
          this.sound("data:audio/wav;base64," + res.data);
        })
        .catch(err => {
          // error from text to speech api
          this.setState({
            questionLoading: false,
            questionSound: "",
            canStartAnswerButton: true
          });
          alert("error please try again");
        });
    }
    if (currentQuestionIndex === questions.length && !endOfQuestions) {
      // end of first questions
      // call api to get second questions
      let res = ["Are you good", "Are you slow", "Are you fast"];
      this.setState(
        {
          questions: res,
          answers: [],
          currentQuestionIndex: 0,
          endOfQuestions: true
        },
        () => {
          this.handleQuestionsAnswering();
        }
      );
    }
    if (currentQuestionIndex === questions.length && endOfQuestions) {
      // end of questions
      // call api to find final result
      let res = "You have coldflu";
      this.setState({ finalResult: res });
      // call text to speech api
      let data = { text: res };
      // call text-to-speech api
      fetch("http://127.0.0.1:8000/api/speech", {
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
            finalResultSound: res.data,
            questionLoading: false,
            viewQuestions: false
          });
          this.sound("data:audio/wav;base64," + res.data);
        })
        .catch(err => {
          // error from text to speech api
          this.setState({
            questionLoading: false,
            questionSound: "",
            canStartAnswerButton: true
          });
          alert("error please try again");
        });
    }
  };

  handleQuestionView = () => {
    const {
      viewQuestions,
      questions,
      questionSound,
      currentQuestionIndex,
      questionLoading,
      isRecordingAnswer,
      canStartAnswerButton,
      finalResult,
      finalResultSound
    } = this.state;

    if (viewQuestions) {
      if (questions.length) {
        // console.log(questions);
        let currentQuestion = questions[currentQuestionIndex];
        if (questionLoading) {
          return <Loading />;
        }
        if (questionSound) {
          // this.sound("data:audio/wav;base64," + questionSound);
          return (
            <div>
              <h4>
                {currentQuestion}{" "}
                <Button
                  size="sm"
                  onClick={() => {
                    this.sound("data:audio/wav;base64," + questionSound);
                  }}
                  style={{ marginLeft: 5 }}
                  variant="success"
                >
                  hear again
                </Button>
              </h4>
              <div>
                {isRecordingAnswer ? (
                  <Button
                    onClick={() => {
                      this.stopAnswerQuestion();
                    }}
                    variant="primary"
                  >
                    Stop Answering
                  </Button>
                ) : (
                  <Button
                    disabled={!canStartAnswerButton}
                    onClick={() => {
                      this.startAnswerQuestion();
                    }}
                    variant="primary"
                  >
                    Say yes or no
                  </Button>
                )}
              </div>
            </div>
          );
        }
      }
    }
    if (finalResult && finalResultSound) {
      return (
        <div>
          <h4>
            {finalResult}
            <Button
              variant="success"
              size="sm"
              onClick={() => {
                this.sound("data:audio/wav;base64," + finalResultSound);
              }}
            >
              hear again
            </Button>
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
        <Col md="4">
          <img
            src={bodyImage}
            style={{ width: "100%", height: "100%" }}
            alt="body_image"
          />
        </Col>
        <Col md="8">
          <div className="text-center">
            {!isRecording ? (
              <Button
                disabled={!canStartButton}
                variant="outline-primary"
                onClick={this.start}
              >
                start <FontAwesomeIcon icon={faMicrophone} size="lg" />
              </Button>
            ) : (
              <Button variant="outline-primary" onClick={this.stop}>
                stop <FontAwesomeIcon icon={faMicrophoneSlash} size="lg" />
              </Button>
            )}
          </div>

          <Col style={{ marginTop: 5 }} className="text-center">
            {this.handelClientSpeech()}
          </Col>
          <Col style={{ marginTop: 5 }} className="text-center">
            {this.handleQuestionView()}
          </Col>
        </Col>
      </Row>
    );
  }
}

export default MedicalAssistantPage;
