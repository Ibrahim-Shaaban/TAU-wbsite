import React from "react";
import { Card, Button } from "react-bootstrap";
import { connect } from "react-redux";
import { changeCurrentPage } from "../actions";

class DispalyCard extends React.Component {
  onBtnClick = () => {
    const { changeCurrentPage, data } = this.props;
    changeCurrentPage(data.page);
  };

  render() {
    const { reverse, data } = this.props;
    const float = reverse ? "left" : "right";

    return (
      <div className="container-fluid m-4">
        <div
          className="card text-white"
          style={{ border: 0, borderRadius: 0, backgroundColor: "#282d49" }}
        >
          <div className="row">
            {reverse ? (
              <div>{""}</div>
            ) : (
              <div className="col-md-4">
                <img
                  src={data.image}
                  className="w-100"
                  alt={data.title}
                  style={{ width: 100, height: 300 }}
                />
              </div>
            )}

            <div className="col-md-8 px-3">
              <div className="card-block px-3">
                <h4 className="card-title">{data.title}</h4>
                {data.text.map((item, idx) => {
                  return (
                    <Card.Text className="card-text" key={idx}>
                      {item}
                    </Card.Text>
                  );
                })}
                <Button
                  onClick={this.onBtnClick}
                  className="btn btn-primary"
                  style={{ float: float }}
                >
                  Try Now
                </Button>
              </div>
            </div>

            {reverse ? (
              <div className="col-md-4">
                <img
                  src={data.image}
                  className="w-100"
                  alt={data.title}
                  style={{ width: 100, height: 300 }}
                />
              </div>
            ) : (
              <div>{""}</div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  // console.log("Card : ", state);
  return { currentPage: state.currentPage };
};

export default connect(
  mapStateToProps,
  { changeCurrentPage }
)(DispalyCard);
