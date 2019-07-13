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
      canStartButton: true,
      allQuestions: [],
      currentDiseaseIndex: 0,
      currentQuestionAnswerIndex: 0,
      canViewQuestion: false,
      canViewDisease: false,
      disableNoForDisease: false,
      disableNoForQuestion: false
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
        chatSoundArray: [],
        allQuestions: [],
        currentDiseaseIndex: 0,
        currentQuestionAnswerIndex: 0,
        canViewQuestion: false,
        canViewDisease: false
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
            console.log("client said : ", res.text);

            // fetch api to get all possible diseases
            let response = [
              {
                name: "fever",
                questions: [
                  "what is fever",
                  "is fever is good",
                  "is fever is bad"
                ],
                answers: [
                  `answer to what is fever  : Fever is when a human's body temperature goes above the normal range of 36–37° Centigrade (98–100° Fahrenheit). It is a common medical sign. People's normal body temperatures may vary and are affected by factors such as eating, exercise, sleeping, and what time of the day it is. Our body temperature is usually at its highest at around 6 p.m. and at its lowest at about 3 a.m. Other terms for a fever include pyrexia and controlled hyperthermia. As the body temperature goes up, the person may feel cold until it levels off and stops rising.`,
                  `answer to is fever is good  : Fever is when a human's body temperature goes above the normal range of 36–37° Centigrade (98–100° Fahrenheit). It is a common medical sign. People's normal body temperatures may vary and are affected by factors such as eating, exercise, sleeping, and what time of the day it is. Our body temperature is usually at its highest at around 6 p.m. and at its lowest at about 3 a.m. Other terms for a fever include pyrexia and controlled hyperthermia. As the body temperature goes up, the person may feel cold until it levels off and stops rising.`,
                  `answer to is fever is bad  : Fever is when a human's body temperature goes above the normal range of 36–37° Centigrade (98–100° Fahrenheit). It is a common medical sign. People's normal body temperatures may vary and are affected by factors such as eating, exercise, sleeping, and what time of the day it is. Our body temperature is usually at its highest at around 6 p.m. and at its lowest at about 3 a.m. Other terms for a fever include pyrexia and controlled hyperthermia. As the body temperature goes up, the person may feel cold until it levels off and stops rising.`
                ]
              },
              {
                name: "front-end and back-end",
                questions: [
                  "what is front-end and back-end",
                  "is cold is front-end and back-end",
                  "is cold is front-end and back-end"
                ],
                answers: [
                  `answer to what is front-end and back-end  : Front end and back end are terms used by programmers and computer professionals to describe the layers that make up hardware, a computer program or a website which are delineated based on how accessible they are to a user. In this context, the user refers to an entity that could be human or digital. The back end refers to parts of a computer application or a program's code that allow it to operate and that cannot be accessed by a user. Most data and operating syntax are stored and accessed in the back end of a computer system. Typically the code is comprised of one or more programming languages. The back end is also called the data access layer of software or hardware and includes any functionality that needs to be accessed and navigated to by digital means.`,
                  `answer to is front-end and back-end is good  : Front end and back end are terms used by programmers and computer professionals to describe the layers that make up hardware, a computer program or a website which are delineated based on how accessible they are to a user. In this context, the user refers to an entity that could be human or digital. The back end refers to parts of a computer application or a program's code that allow it to operate and that cannot be accessed by a user. Most data and operating syntax are stored and accessed in the back end of a computer system. Typically the code is comprised of one or more programming languages. The back end is also called the data access layer of software or hardware and includes any functionality that needs to be accessed and navigated to by digital means.`,
                  `answer to are front-end and back-end bad  : Front end and back end are terms used by programmers and computer professionals to describe the layers that make up hardware, a computer program or a website which are delineated based on how accessible they are to a user. In this context, the user refers to an entity that could be human or digital. The back end refers to parts of a computer application or a program's code that allow it to operate and that cannot be accessed by a user. Most data and operating syntax are stored and accessed in the back end of a computer system. Typically the code is comprised of one or more programming languages. The back end is also called the data access layer of software or hardware and includes any functionality that needs to be accessed and navigated to by digital means.`
                ]
              },
              {
                name: "cancer",
                questions: [
                  "what is cancer",
                  "is cancer is good",
                  "is cancer is bad"
                ],
                answers: [
                  `answer to what is cancer  : Cells are the basic units that make up the human body. Cells grow and divide to make new cells as the body needs them. Usually, cells die when they get too old or damaged. Then, new cells take their place. Cancer begins when genetic changes interfere with this orderly process. Cells start to grow uncontrollably. These cells may form a mass called a tumor. A tumor can be cancerous or benign. A cancerous tumor is malignant, meaning it can grow and spread to other parts of the body. A benign tumor means the tumor can grow but will not spread. Some types of cancer do not form a tumor. These include leukemias, most types of lymphoma, and myeloma.`,
                  `answer to is cancer is good  : Cells are the basic units that make up the human body. Cells grow and divide to make new cells as the body needs them. Usually, cells die when they get too old or damaged. Then, new cells take their place. Cancer begins when genetic changes interfere with this orderly process. Cells start to grow uncontrollably. These cells may form a mass called a tumor. A tumor can be cancerous or benign. A cancerous tumor is malignant, meaning it can grow and spread to other parts of the body. A benign tumor means the tumor can grow but will not spread. Some types of cancer do not form a tumor. These include leukemias, most types of lymphoma, and myeloma.`,
                  `answer to is cancer is bad  : Cells are the basic units that make up the human body. Cells grow and divide to make new cells as the body needs them. Usually, cells die when they get too old or damaged. Then, new cells take their place. Cancer begins when genetic changes interfere with this orderly process. Cells start to grow uncontrollably. These cells may form a mass called a tumor. A tumor can be cancerous or benign. A cancerous tumor is malignant, meaning it can grow and spread to other parts of the body. A benign tumor means the tumor can grow but will not spread. Some types of cancer do not form a tumor. These include leukemias, most types of lymphoma, and myeloma.`
                ]
              }
            ];
            this.setState({
              allQuestions: response,
              canViewDisease: true,
              clientSpeechLoading: false
            });
            // this.setState({
            //   clientSpeech: res.text,
            //   clientSpeechLoading: false,
            //   chatLoading: true
            // });

            // call entity api to get answer of question
            // let response =
            //   "Front end and back end are terms used by programmers and computer professionals to describe the layers that make up hardware, a computer program or a website which are delineated based on how accessible they are to a user. In this context, the user refers to an entity that could be human or digital. The back end refers to parts of a computer application or a program's code that allow it to operate and that cannot be accessed by a user. Most data and operating syntax are stored and accessed in the back end of a computer system. Typically the code is comprised of one or more programming languages. The back end is also called the data access layer of software or hardware and includes any functionality that needs to be accessed and navigated to by digital means.";

            // let response =
            //   "Cells are the basic units that make up the human body. Cells grow and divide to make new cells as the body needs them. Usually, cells die when they get too old or damaged. Then, new cells take their place. Cancer begins when genetic changes interfere with this orderly process. Cells start to grow uncontrollably. These cells may form a mass called a tumor. A tumor can be cancerous or benign. A cancerous tumor is malignant, meaning it can grow and spread to other parts of the body. A benign tumor means the tumor can grow but will not spread. Some types of cancer do not form a tumor. These include leukemias, most types of lymphoma, and myeloma.";
            // let response =
            //   "Love is one of the most profound emotions we experience as humans. It’s bigger than us, meaning, though we can invite it into our lives, we do not have the control over the how, when and where love starts to express itself. Maybe that’s why 72% of people believe in love at first sight. Sometimes, love truly does strike like a bolt of lightening to the chest, and you aren’t prepared for it Since love is inherently free, we spend nights tossing and turning in an attempt to understand what it is, and how to know if we have it. How do you define something so uncontrollable and versatile? That’s the tricky thing about love, we can feel it in a variety of different states–when we’re happy, sad, angry, confused or excited–and our attitudes about love can range from affectionate love, to infatuation and pleasure. We even use love as an action, as a force to keep our relationships with partners, or friends and family, together.";
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

  acceptDisease = () => {
    console.log("accept disease");
    this.setState({ canViewDisease: false, canViewQuestion: true });
  };

  refuseDisease = () => {
    console.log("client refuses disease ");
    const { currentDiseaseIndex, allQuestions } = this.state;
    if (currentDiseaseIndex + 2 === allQuestions.length) {
      this.setState({ disableNoForDisease: true });
    }
    this.setState({ currentDiseaseIndex: currentDiseaseIndex + 1 });
  };

  acceptQuestion = () => {
    console.log("accept question");
    this.setState({ canViewQuestion: false, chatLoading: true });
    const {
      currentDiseaseIndex,
      currentQuestionAnswerIndex,
      allQuestions
    } = this.state;
    const cuurentAnsewer =
      allQuestions[currentDiseaseIndex].answers[currentQuestionAnswerIndex];
    let splittedResponse = this.splitResponse(cuurentAnsewer, 20);
    this.setState({
      chatSpeech: cuurentAnsewer,
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
  };

  refuseQuestion = () => {
    console.log("refuse question");
    const {
      currentQuestionAnswerIndex,
      allQuestions,
      currentDiseaseIndex
    } = this.state;
    if (
      currentQuestionAnswerIndex + 2 ===
      allQuestions[currentDiseaseIndex].questions.length
    ) {
      console.log("currentQuestionAnswerIndex", currentQuestionAnswerIndex + 2);
      console.log(
        "length of questions : ",
        allQuestions[currentDiseaseIndex].questions.length
      );
      this.setState({ disableNoForQuestion: true });
    }
    this.setState({
      currentQuestionAnswerIndex: currentQuestionAnswerIndex + 1
    });
  };

  handleAnswerView = () => {
    const {
      chatLoading,
      chatSpeech,
      chatSoundArray,
      chatSpeechArray,
      allQuestions,
      currentDiseaseIndex,
      currentQuestionAnswerIndex
    } = this.state;
    
    if (chatLoading) {
      const currentQuestion =
      allQuestions[currentDiseaseIndex].questions[currentQuestionAnswerIndex];
      return (
        <div>
          <h4 style={{ marginBottom: 10 }}>
            <span
              style={{
                color: "#F40064",
                fontWeight: "bold",
                fontStyle: "italic",
                fontSize: "30px"
              }}
            >
            {currentQuestion} {""} ?
            </span>
          </h4>
          <Loading size="large" />
        </div>
      );
    }

    if (chatSoundArray.length === chatSpeechArray.length && chatSpeech) {
      const currentQuestion =
      allQuestions[currentDiseaseIndex].questions[currentQuestionAnswerIndex];
      return (
        <div>
          <h4 style={{ marginBottom: 10 }}>
            <span
              style={{
                color: "#F40064",
                fontWeight: "bold",
                fontStyle: "italic",
                fontSize: "30px"
              }}
            >
            {currentQuestion} {""} ?
            </span>
          </h4>
          <div
            style={{
              color: "white",
              border: "1px solid white",
              borderRadius: "15px",
              padding: "10px"
            }}
          >
            <h4>
              {chatSpeech}{" "}
              <Button
                style={{ marginLeft: 7 }}
                variant="success"
                size="sm"
                onClick={() => {
                  // console.log(chatSound);
                  // let finalSound = chatSound.join();
                  console.log(chatSoundArray);
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
        </div>
      );
    }
  };

  handelClientSpeechView = () => {
    const {
      // clientSpeech,
      clientSpeechLoading,
      allQuestions,
      currentDiseaseIndex,
      currentQuestionAnswerIndex,
      canViewQuestion,
      canViewDisease,
      disableNoForDisease,
      disableNoForQuestion
    } = this.state;
    if (clientSpeechLoading) {
      return <Loading size="large" />;
    }
    if (canViewDisease) {
      const currentDisease = allQuestions[currentDiseaseIndex].name;
      return (
        <div>
          <h4 style={{ color: "white" }}>
            Do you mean{" "}
            <span
              style={{
                color: "#F40064",
                fontWeight: "bold",
                fontStyle: "italic",
                fontSize: "30px"
              }}
            >
              {currentDisease}{" "}
            </span>
            ?
          </h4>
          <Button
            onClick={() => {
              this.acceptDisease();
            }}
          >
            Yes
          </Button>
          <Button
            style={{ marginLeft: 10 }}
            onClick={() => {
              this.refuseDisease();
            }}
            disabled={disableNoForDisease}
          >
            No
          </Button>
        </div>
      );
    }

    if (canViewQuestion) {
      const currentQuestion =
        allQuestions[currentDiseaseIndex].questions[currentQuestionAnswerIndex];
      return (
        <div>
          <h4 style={{ color: "white" }}>
            Do you mean{" "}
            <span
              style={{
                color: "#F40064",
                fontWeight: "bold",
                fontStyle: "italic",
                fontSize: "30px"
              }}
            >
              {currentQuestion}{" "}
            </span>
            ?
          </h4>
          <Button
            onClick={() => {
              this.acceptQuestion();
            }}
          >
            Yes
          </Button>
          <Button
            style={{ marginLeft: 10 }}
            onClick={() => {
              this.refuseQuestion();
            }}
            disabled={disableNoForQuestion}
          >
            No
          </Button>
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
            {this.handelClientSpeechView()}
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
