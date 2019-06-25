import React from "react";
import Recorder from "recorder-js";

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
      clientPushState: 0,
      clientEditState: 0,
      chatPushState: 0,
      chattEditState: 0
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
        chatState: false // for loading
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
      fetch("http://127.0.0.1:9000/api/record", {
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
            // call chatbot api
            fetch("http://127.0.0.1:7000/api/chatbot", {
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
              },
              method: "POST",
              body: JSON.stringify({ text: res.text })
            })
              .then(res => res.json())
              .then(res => {
                const result =
                  res.results[0].lexicalEntries[0].entries[0].senses[0]
                    .definitions[0];
                console.log("chatbot result :", result);

                this.setState({ chatSpeech: result });
                let data = { text: result };
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
                      currentChatIndex: currentChatIndex + 2
                    });
                    // console.log(
                    //   "after third api success",
                    //   this.state.allChatArray
                    // );
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
                      currentChatIndex: currentChatIndex + 2
                    });
                    this.sound("data:audio/wav;base64," + res.data);
                  });
              });
          }
          if (res.error === "1") {
            // console.log("please try again");
            const { allChatArray, currentClinetInedx } = this.state;
            allChatArray.splice(currentClinetInedx, 1);
            this.setState({ allChatArray });
          }
        });
    });
  };

  dontGotStream = error => {
    console.log("Get stream failed", error);
  };

  clientSpeech = () => {
    const { clientSpeech, clientSpeechLoading } = this.state;
    if (clientSpeechLoading) {
      return <div>{`loading`}</div>;
    }
    if (clientSpeech) {
      return <div>{`You : ${clientSpeech}`}</div>;
    }
  };

  chatSpeech = () => {
    const { chatSpeech, chatState, chatSound } = this.state;
    if (chatState === "loading") {
      return <div>loading</div>;
    }
    if (chatSpeech && chatState) {
      return (
        <div>
          {`TAU : ${chatSpeech}`}
          <button
            onClick={() => {
              this.sound("data:audio/wav;base64," + chatSound);
            }}
          >
            hear again
          </button>
        </div>
      );
    }
  };

  handleView = () => {
    const { allChatArray } = this.state;
    return allChatArray.map(obj => {
      if (obj.type === "client") {
        if (obj.clientSpeechLoading) {
          return <div>loading</div>;
        }
        if (obj.clientSpeech) {
          return <div>{`You : ${obj.clientSpeech}`}</div>;
        }
      }
      if (obj.type === "chat") {
        if (obj.chatState === "loading") {
          return <div>loading</div>;
        }
        if (obj.chatSpeech && obj.chatState) {
          return (
            <div>
              {`TAU : ${obj.chatSpeech}`}
              <button
                onClick={() => {
                  this.sound("data:audio/wav;base64," + obj.chatSound);
                }}
              >
                hear again
              </button>
            </div>
          );
        }
      }
    });
  };

  render() {
    const { isRecording } = this.state;
    // console.log(allChatArray);
    return (
      <div>
        <div>
          {!isRecording ? (
            <button onClick={this.start}>start</button>
          ) : (
            <button onClick={this.stop}>stop</button>
          )}
        </div>
        {/* <div>{this.clientSpeech()}</div>
        <div>{this.chatSpeech()}</div> */}
        <div>{this.handleView()}</div>
      </div>
    );
  }
}

export default ChatPage;
