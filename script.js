
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

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
  statusText.textContent =
    "Speech recognition is not supported in this browser.";
} else {
  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  recognition.onstart = () => {
    finalTranscript = transcriptBox.value;
    startBtn.disabled = true;
    stopBtn.disabled = false;
    statusText.textContent = "Listening...";
  };

  recognition.onresult = (event) => {
    let interimTranscript = "";

    for (let i = 0; i < event.results.length; i++) {
      const text = event.results[i][0].transcript;

      if (event.results[i].isFinal) {
        if (!event.results[i].processed) {
          finalTranscript += text + " ";
          event.results[i].processed = true;
        }
      } else {
        interimTranscript += text;
      }
    }

    transcriptBox.value =
      finalTranscript + interimTranscript;
  };

  recognition.onerror = (event) => {
    statusText.textContent = "Error: " + event.error;
  };

  recognition.onend = () => {
    startBtn.disabled = false;
    stopBtn.disabled = true;
    statusText.textContent = "Recording stopped.";
  };

  startBtn.onclick = () => {
    recognition.lang = languageSelect.value;
    try {
      recognition.start();
    } catch (error) {
      statusText.textContent = "Please wait and try again.";
    }
  };

  stopBtn.onclick = () => recognition.stop();
}

copyBtn.onclick = async () => {
  await navigator.clipboard.writeText(transcriptBox.value);
  statusText.textContent = "Text copied!";
};

downloadBtn.onclick = () => {
  const blob = new Blob([transcriptBox.value], {
    type: "text/plain"
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "my-transcript.txt";
  link.click();
  URL.revokeObjectURL(url);
};

clearBtn.onclick = () => {
  if (recognition && !stopBtn.disabled) {
    recognition.stop();
  }

  finalTranscript = "";
  transcriptBox.value = "";
  statusText.textContent = "Transcript cleared.";
};


