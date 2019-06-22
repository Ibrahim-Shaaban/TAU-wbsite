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
      uploadStatus: false,
      error: null
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
        // for handling not uploading the same image each time into the form
        document.getElementById("ResetBtn").click();
        this.setState({ uploadStatus: true, imageFile: null });
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

      this.setState({ imageFile: imageFile, uploadStatus: false, error: "" });
    } else {
      this.setState({ error: "Invalid FileType" });
    }
  };

  render() {
    const { imageFile, uploadStatus, error } = this.state;

    return (
      <div style={{ padding: 10, textAlign: "center" }}>
        <Form onSubmit={this.OnFormSubmit}>
          <Button id="ResetBtn" type="reset" style={{ visibility: "hidden" }}>
            Reset
          </Button>
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
          <Button
            variant="primary"
            type="submit"
            disabled={error ? true : false}
          >
            Upload
          </Button>
        </Form>
        {error ? (
          <div style={{ paddingTop: 20 }} className="text-danger">
            {error}
          </div>
        ) : uploadStatus ? (
          <div style={{ paddingTop: 20 }} className="text-primary">
            image uploaded Successfully ....
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
      </div>
    );
  }
}

export default XRayPage;
