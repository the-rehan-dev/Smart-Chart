# Smart Chat

A lightweight AI chatbot that runs in the browser. Type a message, and Smart Chat sends it to Google's Gemini API and shows the reply in a clean chat interface.

## Features

- Chat interface with separate user and bot message bubbles
- Error messages for a missing API key, failed requests or empty responses
- Responsive layout for desktop and mobile
- No framework or backend, only HTML, CSS and JavaScript
  
## Tech Stack

- HTML5, CSS3, JavaScript (ES modules)
- [Google Gemini API](https://ai.google.dev/) via the `@google/genai` SDK

## Getting Started

1. **Clone or download** this repository.
2. **Get a Gemini API key** from [Google AI Studio](https://aistudio.google.com/).
3. **Add your key** in `app.js`:
```js
   this.API_KEY = "YOUR_API_KEY_HERE";
4. **Run a local server** (opening the file directly won't work with ES modules):
```bash
   npx serve
```
   or use the VS Code **Live Server** extension.
5. Open the local URL in your browser and start chatting.```

## Configuration

The model is set in `getResponse()` in `app.js`:

```js
model: "gemini-3.5-flash"
```

Google retires models regularly. If you get a 404 error, check the [Gemini deprecations page](https://ai.google.dev/gemini-api/docs/deprecations) for a current model name.

## Security Note

The API key is stored in client-side code, so anyone can read it from the browser. This setup is for local testing only. Never commit a real key to GitHub. For a public deployment, restrict the key by HTTP referrer or route requests through a backend.

## Known Limitations

- No conversation memory (each message is sent independently)
- Replies are plain text (no Markdown rendering)
- No streaming
