import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import Image from "react-bootstrap/Image";

class XRayPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      imageFile: null,
      uploadStatus: false
    };
  }

  OnFormSubmit = e => {
    e.preventDefault();
    const { imageFile } = this.state;
    const formData = new FormData();
    formData.append("image", imageFile, imageFile.name);

    axios
      .post("http://localhost:5001/xray", formData, {
        onUploadProgress: e => {
          console.log(
            `Uploading .... ${Math.round((e.loaded / e.total) * 100)}%`
          );
        }
      })
      .then(res => {
        console.log(res);
        this.setState({ uploadStatus: true, imageFile: null });
      })
      .catch(err => console.log("error", err));
  };

  onFileChange = e => {
    console.log("image : ", e.target.files[0]);
    const fileReader = new FileReader();
    fileReader.readAsDataURL(e.target.files[0]);
    fileReader.onload = event => {
      document.getElementById("imageDisp").src = event.target.result;
    };

    this.setState({ imageFile: e.target.files[0], uploadStatus: false });
  };

  render() {
    const { imageFile, uploadStatus } = this.state;
    return (
      <div style={{ padding: 100, textAlign: "center" }}>
        <Form onSubmit={this.OnFormSubmit}>
          <Form.Group>
            <Form.Label> Xray Image </Form.Label>
            <Form.Control
              style={{ display: "none" }}
              type="file"
              onChange={this.onFileChange}
              ref={fileInput => (this.fileInput = fileInput)}
            />
          </Form.Group>
          <Button
            onClick={() => this.fileInput.click()}
            style={{ marginRight: 10 }}
          >
            Choose Image ...
          </Button>
          <Button variant="primary" type="submit">
            Upload
          </Button>
        </Form>
        {uploadStatus ? (
          <div style={{ paddingTop: 20 }}>image uploaded Successfully ....</div>
        ) : (
          <Image id="imageDisp" src={imageFile} fluid />
        )}
      </div>
    );
  }
}

export default XRayPage;
