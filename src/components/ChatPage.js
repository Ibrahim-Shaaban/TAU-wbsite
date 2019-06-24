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
      chatState: false
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
    this.recorder.start().then(() => this.setState({ isRecording: true }));
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
      this.setState({
        isRecording: false,
        blob
      });
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
          if (res.error == "0") {
            console.log("client said : ", res.text);
            this.setState({ clientSpeech: res.text, chatState: "loading" });
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
                    this.setState({ chatState: true, chatSound: res.data });
                    var snd = this.sound("data:audio/wav;base64," + res.data);
                  });
              })
              .catch(console.log);
          }
        });
    });
  };

  dontGotStream = error => {
    console.log("Get stream failed", error);
  };

  clientSpeech = () => {
    const { clientSpeech } = this.state;
    if (clientSpeech) {
      return <div>{`You : ${clientSpeech}`}</div>;
    }
    return <div>{`loading`}</div>;
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
              var snd = this.sound("data:audio/wav;base64," + chatSound);
            }}
          >
            hear again
          </button>
        </div>
      );
    }
  };

  render() {
    const { isRecording } = this.state;
    return (
      <div>
        <div>
          {!isRecording ? (
            <button onClick={this.start}>start</button>
          ) : (
            <button onClick={this.stop}>stop</button>
          )}
        </div>
        <div>{this.clientSpeech()}</div>
        <div>{this.chatSpeech()}</div>
      </div>
    );
  }
}

export default ChatPage;
