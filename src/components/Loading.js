import React from "react";
import { Spinner } from "react-bootstrap";

class Loading extends React.Component {
  constructor() {
    super();
    this.state = { size: "sm" };
  }

  componentDidMount() {
    if (this.props.size) {
      this.setState({ size: this.props.size });
    }
  }
  render() {
    const { size } = this.state;
    if (size === "large") {
      return (
        <div>
          <Spinner animation="grow" variant="primary" />
          <Spinner animation="grow" variant="secondary" />
          <Spinner animation="grow" variant="success" />
          <Spinner animation="grow" variant="danger" />
          <Spinner animation="grow" variant="warning" />
          <Spinner animation="grow" variant="info" />
          <Spinner animation="grow" variant="dark" />
        </div>
      );
    }
    return (
      <div>
        <Spinner animation="grow" variant="primary" size="sm" />
        <Spinner animation="grow" variant="secondary" size="sm" />
        <Spinner animation="grow" variant="success" size="sm" />
        <Spinner animation="grow" variant="danger" size="sm" />
        <Spinner animation="grow" variant="warning" size="sm" />
        <Spinner animation="grow" variant="info" size="sm" />
        <Spinner animation="grow" variant="dark" size="sm" />
      </div>
    );
  }
}

export default Loading;
