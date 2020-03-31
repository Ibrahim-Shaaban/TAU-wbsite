// localhost

const apiEndPoints = {
  textToSpeechUrl: "http://127.0.0.1:8000/api/speech",
  speechToTextUrl: "http://127.0.0.1:9000/api/record",
  chatBotUrl: "https://2f4cdb7a.ngrok.io/api/chatbot",
  chestUrl: "http://127.0.0.1:5002/api/chest",
  skinUrl: "https://b6779b03.ngrok.io/api/skin",
  bodyPartUrl: "http://8ffc07b0.ngrok.io/api/part",
  medicalResultUr: "http://8ffc07b0.ngrok.io/api/answer"
};

// ngrok
const apiUrls = {
  textToSpeechUrl: "https://cc71c1ec.ngrok.io/api/tts",
  speechToTextUrl: "https://cc71c1ec.ngrok.io/api/sr",
  chatBotUrl: "https://8bab01ff.ngrok.io/api/chatbot",
  chestUrl: "https://c0d31cdc.ngrok.io/api/chest",
  skinUrl: "https://b6779b03.ngrok.io/api/skin",
  bodyPartUrl: "http://e119a7c6.ngrok.io/api/part",
  medicalResultUr: "http://e119a7c6.ngrok.io/api/answer"
};

module.exports = apiEndPoints;
// module.exports = apiUrls;
