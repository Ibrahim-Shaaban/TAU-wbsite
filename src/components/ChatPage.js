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
      // this.setState({
      //   isRecording: false,
      //   blob,
      //   clientSpeechLoading: true
      // });
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

      // console.log(this.state.clientSpeechLoading);
      // console.log("after stop", this.state.allChatArray);
      // console.log(blob);
      let fd = new FormData();
      fd.append("fname", "sound_file");
      fd.append("data", blob);
      // call speech-to-text api
      fetch("http://127.0.0.1:9000/api/record", {
        // headers: {
        // 'Content-Type': 'false'
        // },
        method: "PUT",
        body: fd
      })
        .then(res => res.json())
        .then(res => {
          if (res.error === "0") {
            console.log("client said : ", res.text);

            // this.setState({
            //   clientSpeech: res.text,
            //   chatState: "loading",
            //   clientSpeechLoading: false
            // });
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
            // console.log("after first api success", this.state.allChatArray);
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
                // console.log(
                //   "after second api success",
                //   this.state.allChatArray
                // );
                let data = { text: result };
                // console.log(JSON.stringify(data.text)) ;
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
                    // this.setState({
                    //   chatState: true,
                    //   chatSound: res.data,
                    //   currentClinetInedx: currentClinetInedx + 2,
                    //   currentChatIndex: currentChatIndex + 2
                    // });
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
              .catch(console.log);
          }
          if (res.error === "1") {
            console.log("please try again");
          }
        });
    });
  };

  dontGotStream = error => {
    console.log("Get stream failed", error);
  };

  clientSpeech = () => {
    const {
      clientSpeech,
      clientSpeechLoading
      // allChatArray,
      // currentClinetInedx,
      // clientEditState,
      // clientPushState
    } = this.state;
    if (clientSpeechLoading) {
      // console.log("clientSpeechLoading", clientSpeechLoading);
      // if (clientPushState === 0) {
      //   // check if we pushed this before
      //   allChatArray.push({
      //     type: "client",
      //     clientSpeechLoading,
      //     clientSpeech
      //   });
      //   this.setState({ allChatArray, clientPushState: 1 });
      //   // console.log(allChatArray);
      // }

      return <div>{`loading`}</div>;
    }
    if (clientSpeech) {
      // if (clientEditState === 0) {
      //   allChatArray[currentClinetInedx] = {
      //     type: "client",
      //     clientSpeech,
      //     clientSpeechLoading
      //   };
      //   this.setState({ allChatArray, clientEditState: 1 });
      //   // console.log(allChatArray);
      // }

      return <div>{`You : ${clientSpeech}`}</div>;
    }
  };

  chatSpeech = () => {
    const {
      chatSpeech,
      chatState,
      chatSound
      // allChatArray,
      // currentChatIndex,
      // chatPushState,
      // chattEditState
    } = this.state;
    if (chatState === "loading") {
      // if (chatPushState === 0) {
      //   allChatArray.push({ type: "chat", chatState, chatSpeech, chatSound });
      //   this.setState({ allChatArray, chatPushState: 1 });
      // }

      return <div>loading</div>;
    }
    if (chatSpeech && chatState) {
      // if (chattEditState === 0) {
      //   allChatArray[currentChatIndex] = {
      //     type: "chat",
      //     chatState,
      //     chatSpeech,
      //     chatSound
      //   };
      //   this.setState({ allChatArray, chattEditState: 1 });
      // }

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
