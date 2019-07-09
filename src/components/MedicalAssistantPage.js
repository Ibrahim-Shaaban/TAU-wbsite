import React from "react";
import Recorder from "recorder-js";
import { Button, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faMicrophoneSlash
} from "@fortawesome/free-solid-svg-icons";
import Loading from "./Loading";
import {
  textToSpeechUrl,
  speechToTextUrl,
  bodyPartUrl,
  medicalResultUr
} from "../api/localhost";
import bodyImage from "../images/body1.png";
import ToggleButton from "./ToggleButton";

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
      questions: [1],
      currentQuestionIndex: 0,
      answers: [],
      questionLoading: false,
      questionSound: "",
      viewQuestions: false,
      endOfQuestions: false,
      finalResult: "",
      finalResultSound: "",
      showDefinition: []
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

  headingStyle = {
    color: "white"
  };

  capitalizeString = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  dontGotStream = error => {
    console.log("Get stream failed", error);
  };
  // when client click on start button to start recording
  start = () => {
    this.recorder.start().then(() =>
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
      this.setState({
        isRecordingAnswer: false,
        blob,
        questionLoading: true
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
            if (res.text === "yes") {
              const { currentQuestionIndex, answers, questions } = this.state;
              answers.push(questions[currentQuestionIndex]);
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
            } else if (res.text === "no") {
              const { currentQuestionIndex, answers } = this.state;
              // answers.push(0);
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
            } else {
              alert("sorry please try again");
              this.setState({
                canStartAnswerButton: true,
                questionLoading: false
              });
            }
          }
          if (res.error === "1") {
            // error in speech to text api
            console.log("please try again");

            alert("sorry please try again");
            this.setState({
              canStartAnswerButton: true,
              questionLoading: false
            });
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
        clientSpeechLoading: true,
        canStartButton: false
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
            // handle form of client speech
            let result = res.text.ca;
            this.setState({
              clientSpeech: res.text
            });
            let data = { text: `Did you mean ${res.text} ?` };
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
                  clientSpeechLoading: false,
                  clientSpeechSound: res.data,
                  canStartButton: true
                });
                this.sound("data:audio/wav;base64," + res.data);
              })
              .catch(err => {
                this.setState({
                  clientSpeechLoading: false,
                  // clientSpeechSound: res.data,
                  canStartButton: true
                });
                alert("please try again");
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
    this.setState({
      questionLoading: true,
      viewQuestions: true,
      questions: ["edswfgersthrdtyhrtd"]
    });
    const { clientSpeech } = this.state;
    let data = { part: this.capitalizeString(clientSpeech) };
    // call api to fetch questions from the part chosen by client
    fetch(bodyPartUrl, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      method: "POST",
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(res =>
        this.setState(
          {
            questions: res,
            clientSpeech: ""
            // questionLoading: true,
            // viewQuestions: true
          },
          () => {
            this.handleQuestionsAnswering();
          }
        )
      );
  };
  // client choose no to his part of body
  cancelClientCheck = () => {
    // client said no
    console.log("client said no ");
    this.setState({
      blob: null,
      isRecording: false,
      isRecordingAnswer: false,
      stream: null,
      analyserData: { data: [], lineTo: 0 },
      clientSpeech: "",
      clientSpeechSound: "",
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
    const { clientSpeech, clientSpeechLoading, clientSpeechSound } = this.state;
    if (clientSpeechLoading) {
      return <Loading size="large" />;
    }
    if (clientSpeech && clientSpeechSound) {
      return (
        <div>
          <h4 style={this.headingStyle}>
            Did you mean{" "}
            <span
              style={{
                color: "#1086ff",
                fontWeight: "bold",
                fontStyle: "italic",
                fontSize: "30px"
              }}
            >
              {clientSpeech}
            </span>{" "}
            ?
            <Button
              style={{ marginLeft: 5 }}
              variant="success"
              size="sm"
              onClick={() => {
                this.sound("data:audio/wav;base64," + clientSpeechSound);
              }}
            >
              hear again
            </Button>
          </h4>
          <Button onClick={() => this.confirmClientCheck()} variant="secondary">
            Yes
          </Button>
          <Button
            variant="secondary"
            onClick={() => this.cancelClientCheck()}
            style={{ marginLeft: 10 }}
          >
            No
          </Button>
        </div>
      );
    }
  };
  // make one string from final result
  handleFinalResultSpeech = finalResult => {
    const { showDefinition } = this.state;
    let resultString = "You have ";
    finalResult.forEach((element, index) => {
      showDefinition.push(false);
      if (index === 0) {
        resultString = `${resultString} ${element.name}`;
      } else {
        resultString = `${resultString} or you have ${element.name}`;
      }
    });
    this.setState({ showDefinition });
    return resultString;
  };
  // find next question to display to user
  handleQuestionsAnswering = () => {
    console.log("in handleQuestionsAnswering ");

    const {
      questions,
      currentQuestionIndex,
      endOfQuestions,
      answers
    } = this.state;
    // console.log(questions);
    if (questions.length && questions.length !== currentQuestionIndex) {
      let currentQuestion = questions[currentQuestionIndex];
      // this.setState({ questionLoading: true });
      console.log(currentQuestion);
      // call text to speech api
      let data = { text: currentQuestion.ask };
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
    // if (currentQuestionIndex === questions.length && !endOfQuestions) {
    //   // end of first phase of  questions
    //   // call api to get second phase of questions
    //   let res = ["Are you good", "Are you slow", "Are you fast"];
    //   this.setState(
    //     {
    //       questions: res,
    //       answers: [],
    //       currentQuestionIndex: 0,
    //       endOfQuestions: true
    //     },
    //     () => {
    //       this.handleQuestionsAnswering();
    //     }
    //   );
    // }
    // if (currentQuestionIndex === questions.length && endOfQuestions)
    if (currentQuestionIndex === questions.length) {
      // end of questions
      // call api to find final result
      let data = { symptoms: answers };
      fetch(medicalResultUr, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(data)
      })
        .then(res => res.json())
        .then(res => {
          this.setState({ finalResult: res });
          // call text to speech api
          data = { text: this.handleFinalResultSpeech(res) };
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
        })
        .catch(err => console.log(err));

      // let res = "You have coldflu";
    }
  };

  handleFinalResultView = () => {
    const { finalResult, finalResultSound, showDefinition } = this.state;
    const result = finalResult.map((item, index) => {
      // showDefinition.push(false);
      if (index === 0) {
        return (
          <div>
            <h4 style={this.headingStyle}>
              You have
              {item.name}
              <Button
                variant="success"
                style={{ marginLeft: 5 }}
                size="sm"
                onClick={() => {
                  this.sound("data:audio/wav;base64," + finalResultSound);
                }}
              >
                hear again
              </Button>
            </h4>
            <ToggleButton
              text={item.def}
              youtubeUrl={item.refs.youtube}
              wikiUrl={item.refs.wikipedia}
            />
          </div>
        );
      }
      return (
        <div style={{ marginTop: 5 }}>
          <h4 style={this.headingStyle}>or you have {item.name}</h4>
          <ToggleButton
            text={item.def}
            youtubeUrl={item.refs.youtube}
            wikiUrl={item.refs.wikipedia}
          />
        </div>
      );
    });

    return result;
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
          return <Loading size="large" />;
        }
        if (questionSound) {
          // this.sound("data:audio/wav;base64," + questionSound);
          return (
            <div>
              <h4 style={this.headingStyle}>
                {currentQuestion.ask}{" "}
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
                    variant="secondary"
                  >
                    Stop Answering
                  </Button>
                ) : (
                  <Button
                    disabled={!canStartAnswerButton}
                    onClick={() => {
                      this.startAnswerQuestion();
                    }}
                    variant="secondary"
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
      return <div>{this.handleFinalResultView()}</div>;
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
        <Col
          md="8"
          style={{
            position: "absolute",
            top: "25%",
            right: "25%",
            left: "25%",
            bottom: "25%"
          }}
        >
          <div className="text-center">
            {!isRecording ? (
              <Button
                disabled={!canStartButton}
                variant="primary"
                onClick={this.start}
              >
                Say a part of your body <FontAwesomeIcon icon={faMicrophone} size="lg" />
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
            {this.handleQuestionView()}
          </Col>
        </Col>
      </Row>
    );
  }
}

export default MedicalAssistantPage;
