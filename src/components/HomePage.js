import React from "react";
import { Row, Col } from "react-bootstrap";
import Slider from "./Slider";
import InformationCard from "./InformationCard";
import personImage from "../team_members/ibra.png";
import hatemImg from "../team_members/hatem2.png";
import makerImg from "../team_members/maker2.png";
import hananImg from "../team_members/hanan.png";
import rehabImg from "../team_members/rehab.png";

class HomePage extends React.Component {
  handleTeamMembersView = () => {
    const members = [
      {
        imgUrl: hatemImg,
        name: "Hatem Zamzam",
        jobTitle: "Deep Learning Researcher",
        facebookUrl: "https://www.facebook.com/",
        twitterUrl: "https://twitter.com/",
        githubUrl: "https://github.com/",
        linkedinUrl: "https://www.linkedin.com/feed/"
      },
      {
        imgUrl: hananImg,
        name: "Hanan Bahy",
        jobTitle: "Deep Learning Researcher",
        facebookUrl: "https://www.facebook.com/",
        twitterUrl: "https://twitter.com/",
        githubUrl: "https://github.com/",
        linkedinUrl: "https://www.linkedin.com/feed/"
      },
      {
        imgUrl: makerImg,
        name: "Mostafa Kamal",
        jobTitle: "Data Scientist",
        facebookUrl: "https://www.facebook.com/",
        twitterUrl: "https://twitter.com/",
        githubUrl: "https://github.com/",
        linkedinUrl: "https://www.linkedin.com/feed/"
      },
      {
        imgUrl: rehabImg,
        name: "Rehab Reda",
        jobTitle: "Deep learning Researcher",
        facebookUrl: "https://www.facebook.com/",
        twitterUrl: "https://twitter.com/",
        githubUrl: "https://github.com/",
        linkedinUrl: "https://www.linkedin.com/feed/"
      },
      {
        imgUrl: personImage,
        name: "Ibrahim Shaaban",
        jobTitle: "Full Stack Developer",
        facebookUrl: "https://www.facebook.com/",
        twitterUrl: "https://twitter.com/",
        githubUrl: "https://github.com/",
        linkedinUrl: "https://www.linkedin.com/feed/"
      }
    ];

    return members.map(member => {
      return (
        <Col md="3" style={{ marginBottom: 10 }}>
          <InformationCard info={member} />
        </Col>
      );
    });
  };

  render() {
    return (
      <div style={{ color: "white" }}>
        <Row>
          <Col md="12" className="text-center" style={{ marginBottom: "10px" }}>
            <h2>Ai HealthCare Assistant Using Deep Learning</h2>
          </Col>

          <Col md="8" className="m-auto">
            <Slider />
          </Col>

          <Col
            md="12"
            className="text-center"
            style={{ marginBottom: 5, marginTop: 10 }}
          >
            <h2>Team Members</h2>
          </Col>

          <Row style={{ justifyContent: "center" }}>
            {this.handleTeamMembersView()}
          </Row>
        </Row>
      </div>
    );
  }
}

export default HomePage;
