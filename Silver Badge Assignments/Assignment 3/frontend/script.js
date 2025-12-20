const recordBtn = document.getElementById("recordBtn");
const statusEl = document.getElementById("status");
const recognizedTextEl = document.getElementById("recognizedText");
const translatedTextEl = document.getElementById("translatedText");

const inputLang = document.getElementById("inputLang");
const outputLang = document.getElementById("outputLang");

const playInputBtn = document.getElementById("playInput");
const playOutputBtn = document.getElementById("playOutput");

let lastRecognizedText = "";
let lastTranslatedText = "";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();

recordBtn.onclick = () => {
  recognition.lang = inputLang.value;
  recognition.start();

  recordBtn.textContent = "⏺ Recording...";
  recordBtn.className = "recording";
  statusEl.textContent = "Listening...";
  statusEl.className = "status recording";
};

recognition.onresult = async (event) => {
  recognition.stop();

  lastRecognizedText = event.results[0][0].transcript;
  recognizedTextEl.textContent = lastRecognizedText;
  playInputBtn.disabled = false;

  stopRecording();

  const response = await fetch("http://127.0.0.1:5000/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      text: lastRecognizedText,
      source_language: inputLang.value,
      target_language: outputLang.value
    })
  });

  const data = await response.json();
  lastTranslatedText = data.translated_text;
  translatedTextEl.textContent = lastTranslatedText;
  playOutputBtn.disabled = false;

  speak(lastTranslatedText, outputLang.value);
};

recognition.onerror = () => {
  stopRecording();
};

function stopRecording() {
  recordBtn.textContent = "🎙 Start Recording";
  recordBtn.className = "idle";
  statusEl.textContent = "Idle";
  statusEl.className = "status idle";
}

function speak(text, lang) {
  if (!text) return;

  window.speechSynthesis.cancel(); // stop overlapping speech

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 1;
  utterance.pitch = 1;

  window.speechSynthesis.speak(utterance);
}


playInputBtn.onclick = () => {
  speak(lastRecognizedText, inputLang.value);
};

playOutputBtn.onclick = () => {
  speak(lastTranslatedText, outputLang.value);
};