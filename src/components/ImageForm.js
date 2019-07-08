import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Image from "react-bootstrap/Image";
// import { chestUrl } from "../api/localhost";
import Loading from "./Loading";

class ImageForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageFile: null,
      uploadStatus: false,
      error: null,
      finalResult: "",
      resultLoading: false
    };
  }

  componentWillReceiveProps() {
    this.setState({
      imageFile: null,
      uploadStatus: false,
      error: null,
      finalResult: "",
      resultLoading: false
    });
  }

  OnFormSubmit = e => {
    e.preventDefault();
    this.setState({ resultLoading: true });
    const { imageFile } = this.state;
    const formData = new FormData();
    formData.append("image", imageFile, imageFile.name);

    axios
      .post(this.props.url, formData, {
        onUploadProgress: e => {
          console.log(
            `Uploading .... ${Math.round((e.loaded / e.total) * 100)}%`
          );
        }
      })
      .then(res => {
        let response = res.data;
        console.log(response);
        if (response.error === "0") {
          this.setState({
            uploadStatus: true,
            imageFile: null,
            resultLoading: false,
            finalResult: response.text.slice(2, -2)
          });
          // for handling not uploading the same image each time into the form
          // document.getElementById("ResetBtn").click();
        }
      })
      .catch(err => console.log("error", err));
  };

  imageValidator = file => {
    const fileExt = file.name.split(".").pop();
    const acceptedTypes = ["png", "jpg", "jpeg"];
    if (
      acceptedTypes.filter(type => fileExt.toLowerCase() === type).length >= 1
    ) {
      return 1;
    } else {
      return 0;
    }
  };

  onFileChange = e => {
    const imageFile = e.target.files[0];
    console.log("image : ", imageFile);

    if (this.imageValidator(imageFile)) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(imageFile);
      fileReader.onload = event => {
        document.getElementById("imageDisp").src = event.target.result;
      };

      this.setState({
        imageFile: imageFile,
        uploadStatus: false,
        error: null,
        finalResult: "",
        resultLoading: false
      });
    } else {
      this.setState({ error: "Invalid FileType" });
    }
  };

  handleResult = () => {
    const { resultLoading, finalResult } = this.state;
    if (resultLoading && !finalResult) {
      return <Loading size="large" />;
    }

    if (finalResult) {
      return (
        <h4 style={{ color: "white" }}>
          You have{" "}
          <span
            style={{
              fontStyle: "italic",
              fontWeight: "bold",
              fontFamily: "cursive",
              color: "#f60860",
              fontSize: "30px" ,
              
            }}
          >
            {finalResult}
          </span>
        </h4>
      );
    }
  };

  handleView = () => {
    const { imageFile, uploadStatus, error } = this.state;

    return (
      <div style={{ padding: 10, textAlign: "center" }}>
        <Form onSubmit={this.OnFormSubmit}>
          <Button id="ResetBtn" type="reset" style={{ visibility: "hidden" }}>
            Reset
          </Button>
          <Form.Group>
            <Form.Label style={{ color: "white" }}>
              {`${this.props.endpoint.toUpperCase()} Image`}
            </Form.Label>
            <Form.Control
              style={{ display: "none" }}
              type="file"
              onChange={this.onFileChange}
              ref={fileInput => (this.fileInput = fileInput)}
            />
          </Form.Group>
          <Button
            variant="primary"
            onClick={() => this.fileInput.click()}
            style={{ marginRight: 10 }}
          >
            Choose Image ...
          </Button>
          <Button
            variant="secondary"
            type="submit"
            disabled={error ? true : false}
          >
            Upload
          </Button>
        </Form>
        {error ? (
          <div
            style={{ paddingTop: 20, color: "white" }}
            className="text-danger"
          >
            {error}
          </div>
        ) : uploadStatus ? (
          <div>
            <div
              style={{ paddingTop: 20, color: "white" }}
              className="text-primary"
            >
              {/* {image uploaded Successfully ....} */}
            </div>
          </div>
        ) : (
          <Image
            id="imageDisp"
            src={imageFile}
            style={{
              marginTop: 10,
              width: 250,
              height: 250,
              visibility: imageFile ? "visible" : "hidden"
            }}
          />
        )}
        <div>{this.handleResult()}</div>
      </div>
    );
  };

  render() {
    return <div>{this.handleView()}</div>;
  }
}

export default ImageForm;
