import React from "react";
import DispalyCard from "./DispalyCard";
import { CardDeck, Row, Container } from "react-bootstrap";
import CardBoot from "./CardBoot";
import About from "./About";

class HomePage extends React.Component {
  render() {
    const medicalPageData = {
      page: "medical",
      title: "Medical Assistant ",
      image: "https://certifiedsource.com/wp-content/uploads/2018/06/ME1.jpg",
      text: [
        "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
        "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat"
      ]
    };
    const xrayPageData = {
      page: "xRay",
      title: "Chest X-Ray Image Diagnosis ",
      image:
        "https://xranm.com/wp-content/uploads/2014/08/doc-holding-xray-2.jpg",
      text: [
        "ajavhdjhas bkj dbaksj bdkasj bdkj abskdj baskj bdkajs bdkja bskjdb aksjdb asld bqkjdb qlw dqow bpqiwn qw hqniow iqhwo beqwoe iqwoie qbwoi qw ",
        "ajavhdjhas bkj dbaksj bdkasj bdkj abskdj baskj bdkajs bdkja bskjdb aksjdb asld bqkjdb qlw dqow bpqiwn qw hqniow iqhwo beqwoe iqwoie qbwoi qw ",
        "ajavhdjhas bkj dbaksj bdkasj bdkj abskdj baskj bdkajs bdkja bskjdb aksjdb asld bqkjdb qlw dqow bpqiwn qw hqniow iqhwo beqwoe iqwoie qbwoi qw "
      ]
    };
    const chatPageData = {
      page: "chat",
      title: "Chat with Baymax ^_^ ",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXNEjtdVptPJ2-Da34VAnt5LVsVGxQVVMDgf_KNVFZmHW16-X_",
      text: [
        ";qeiclnwepovqnwi nqeow in howine hroqwein hrowien rowein rweh234567839846239846 92386 492836 02 349237 -42397 -273- 49273- 49v rwjern wien r",
        "eelfkbwlkjwenr w;e r;we mr;wlme ;lmw;le mrw erqw[pe jqmwpe mrqwpem [rqwpme orqpwoe mqrpwem orwpe omqrwoeg qewinr nwine "
      ]
    };
    const skinPageData = {
      page: "skin",
      title: "Skin Cancer Image Diagnosis ",
      image:
        "https://news-media.stanford.edu/wp-content/uploads/2017/01/24124237/dermatology_sub.jpg",
      text: [
        "سمثبنىثمن ىصمثنى قصىث قصى قصث ىقصثخاة قخهحصثلا قث صقة صثىقخ صثق تصثلا قلاصثخ قصمنث لاق",
        "Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim صث لاتلاضخ veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat"
      ]
    };

    return (
      <Row className="m-4">
        <DispalyCard reverse={false} data={medicalPageData} />
        <DispalyCard reverse={true} data={chatPageData} />
        <DispalyCard reverse={false} data={xrayPageData} />
        <DispalyCard reverse={true} data={skinPageData} />
      </Row>
      // <Row className="m-4">
      //   <CardBoot data={medicalPageData} />
      //   <CardBoot data={chatPageData} />
      //   <CardBoot data={xrayPageData} />
      //   <CardBoot data={skinPageData} />
      // </Row>
    );
  }
}

export default HomePage;
