// localhost

const apiEndPoints = {
  textToSpeechUrl: "http://127.0.0.1:8000/api/speech",
  speechToTextUrl: "http://127.0.0.1:9000/api/record",
  chatBotUrl: "http://127.0.0.1:7000/api/chatbot",
  chestUrl: "https://601ffe15.ngrok.io/api/chest",
  skinUrl: "http://127.0.0.1:5001/api/skin",
  bodyPartUrl: "https://6c565021.ngrok.io/api/part",
  medicalResultUr: "https://6c565021.ngrok.io/api/answer"
};

// ngrok
const apiUrls = {
  textToSpeechUrl: "https://a9c481d2.ngrok.io/api/speech",
  speechToTextUrl: "https://8f074f7b.ngrok.io/api/record",
  chatBotUrl: "http://127.0.0.1:7000/api/chatbot",
  chestUrl: "http://127.0.0.1:5001/api/chest",
  skinUrl: "http://127.0.0.1:5001/api/skin",
  bodyPartUrl: "https://6c565021.ngrok.io/api/part",
  medicalResultUr: "https://6c565021.ngrok.io/api/answer"
};

module.exports = apiEndPoints;
// module.exports = apiUrls;
