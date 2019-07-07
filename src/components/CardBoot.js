import React, { Component } from "react";
import { Card } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { connect } from "react-redux";
import { changeCurrentPage } from "../actions";

class CardBoot extends Component {
  onBtnClick = () => {
    const { changeCurrentPage, data } = this.props;
    changeCurrentPage(data.page);
  };

  render() {
    const { reverse, data } = this.props;
    const float = reverse ? "left" : "right";

    return (
      <Card className="card-style" style={{ flex: 1 }}>
        <Card.Img top width="100%" src={data.image} alt="Card image cap" />
        <Card.Body>
          <Card.Title>{data.title}</Card.Title>
          {data.text.map((item, idx) => {
            return <Card.Text key={idx}>{item}</Card.Text>;
          })}
          <Button
            onClick={this.onBtnClick}
            className="btn btn-primary"
            style={{ float: float }}
          >
            Try Now ..
          </Button>
        </Card.Body>
      </Card>
    );
  }
}

const mapStateToProps = state => {
  console.log("Card : ", state);
  return { currentPage: state.currentPage };
};

export default connect(
  mapStateToProps,
  { changeCurrentPage }
)(CardBoot);
