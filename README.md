# Hhak AI Transcriber

A beginner-friendly speech-to-text web app. It uses the browser's Web Speech API; it does not run its own AI model or require an API key.

## Features
- Speech recognition in supported browsers
- English and other selectable recognition locales (availability depends on the browser/service)
- Editable transcript
- Copy transcript
- Download transcript as a `.txt` file
- Mobile-friendly layout

## Run it
1. Download or clone this repository.
2. Open `index.html` in a supported browser, preferably a current version of Google Chrome.
3. Allow microphone access when prompted.
4. Choose a language and press **Start recording**.

Some browsers require a secure context (HTTPS) for microphone and speech features. GitHub Pages provides HTTPS.

## Publish with GitHub Pages
1. Create a GitHub account at https://github.com if you do not have one.
2. Create a new public repository named `hhak-ai-transcriber`.
3. Upload `index.html`, `styles.css`, `script.js`, and `README.md` to the repository's root.
4. Open the repository's **Settings**.
5. Find **Pages**.
6. Under **Build and deployment**, choose **Deploy from a branch**.
7. Select branch **main** and folder **/(root)**, then save.
8. Wait for GitHub Pages to publish the site. The Pages section will show its website address.

## Important privacy note
Browser speech recognition may send audio to an online recognition provider, depending on the browser. Do not use this demo for confidential or sensitive recordings. Check the browser's privacy information before use.

## Limitations
- This is a starter demo, not a production transcription service.
- Speech recognition support and language availability vary by browser and device.
- Kinyarwanda recognition may not be available even if it appears in the language list.
- It does not upload or store recordings on a server.
