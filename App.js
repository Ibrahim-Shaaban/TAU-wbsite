import React, { Component } from "react";
import { ReactMic } from "react-mic";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      record: false
    };
  }

  downloadFile = absoluteUrl => {
    var link = document.createElement("a");
    link.href = absoluteUrl;
    link.download = "true";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  startRecording = () => {
    console.time("BLOB");
    this.setState({
      record: true
    });
  };

  stopRecording = () => {
    console.timeEnd("BLOB");
    this.setState({
      record: false
    });
  };

  onData = recordedBlob => {
    console.log("chunk of real-time data is: ", recordedBlob);
    // console.log("size", recordedBlob.size);
    // if (recordedBlob.size <= 921 && recordedBlob.size !== 1) {
    //   this.setState({ record: false });
    // }
  };

  onStop = recordedBlob => {
    console.log("recordedBlob is: ", recordedBlob);
    // this.downloadFile(recordedBlob.blobURL);
    // send blob to server
  };

  render() {
    return (
      <div>
        <ReactMic
          record={this.state.record}
          className="sound-wave"
          onStop={this.onStop}
          onData={this.onData}
          strokeColor="#000000"
          backgroundColor="#dadada"
        />
        <button onClick={this.startRecording} type="button">
          Start
        </button>
        <button onClick={this.stopRecording} type="button">
          Stop
        </button>
      </div>
    );
  }
}

export default App;
