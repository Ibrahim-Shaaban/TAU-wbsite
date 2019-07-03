import React from "react";

var style = {
  backgroundColor: "#F8F8F8",
  borderTop: "1px solid #E7E7E7",
  textAlign: "center",
  //   position: "fixed",
  //   left: "0",
  //   bottom: "0",
  height: "40px",
  width: "100%"
  //   float: "right"
};

const Footer = ({ children }) => {
  return (
    <div>
      <div style={style}>{children}</div>
    </div>
  );
};

export default Footer;
