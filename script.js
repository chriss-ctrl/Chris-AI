const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");
const clearBtn = document.getElementById("clearBtn");
const transcriptBox = document.getElementById("transcript");
const languageSelect = document.getElementById("language");
const statusText = document.getElementById("status");

let recognition;
let finalTranscript = "";

if (!SpeechRecognition) {
  startBtn.disabled = true;
  statusText.textContent = "Speech recognition is not supported in this browser. Try an up-to-date version of Google Chrome.";
} else {
  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = () => {
    statusText.textContent = "Listening… Speak clearly.";
    startBtn.disabled = true;
    stopBtn.disabled = false;
  };

  recognition.onresult = (event) => {
    let interimTranscript = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const text = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += text + " ";
      } else {
        interimTranscript += text;
      }
    }
    transcriptBox.value = finalTranscript + interimTranscript;
  };

  recognition.onerror = (event) => {
    statusText.textContent = "Recognition issue: " + event.error + ". Check microphone permission and connection.";
  };

  recognition.onend = () => {
    startBtn.disabled = false;
    stopBtn.disabled = true;
    if (statusText.textContent.startsWith("Listening")) {
      statusText.textContent = "Recording stopped. You can start again.";
    }
  };

  startBtn.addEventListener("click", () => {
    finalTranscript = transcriptBox.value.trim();
    if (finalTranscript) finalTranscript += " ";
    recognition.lang = languageSelect.value;
    try {
      recognition.start();
    } catch (error) {
      statusText.textContent = "Could not start. Please wait a moment and try again.";
    }
  });

  stopBtn.addEventListener("click", () => recognition.stop());
}

copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(transcriptBox.value);
    statusText.textContent = "Transcript copied.";
  } catch {
    transcriptBox.select();
    statusText.textContent = "Select the text and copy it using your phone's Copy option.";
  }
});

downloadBtn.addEventListener("click", () => {
  const blob = new Blob([transcriptBox.value], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "my-transcript.txt";
  link.click();
  URL.revokeObjectURL(url);
  statusText.textContent = "Transcript download started.";
});

clearBtn.addEventListener("click", () => {
  if (recognition && stopBtn.disabled === false) recognition.stop();
  finalTranscript = "";
  transcriptBox.value = "";
  statusText.textContent = "Transcript cleared.";
});
