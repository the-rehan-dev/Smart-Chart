import { GoogleGenAI } from "https://esm.run/@google/genai";

class ChatUI {
  constructor() {
    this.form = document.getElementById("chat-form");
    this.prompt = document.getElementById("user-text");
    this.sendBtn = document.getElementById("send-btn");
    this.main = document.getElementById("main");
    this.welcome = document.getElementById("welcome-message");
  }
  scrollToBottom() {
    requestAnimationFrame(() => {
      this.main.scrollTo({
        top: this.main.scrollHeight,
        behavior: "smooth",
      });
    });
  }
  createChatBox(userText, botText = "Thinking...") {
    if (this.welcome) this.welcome.style.display = "none";

    const chatBox = document.createElement("div");
    chatBox.className = "chat-box";

    const userDiv = document.createElement("div");
    userDiv.className = "user-box";
    userDiv.innerHTML = `
      <div class="text-content">
        <img src="./img/user.png" alt="" />
        <p></p>
      </div>`;
    userDiv.querySelector("p").textContent = userText;

    const botDiv = document.createElement("div");
    botDiv.className = "bot-box is-loading";
    botDiv.innerHTML = `
      <div class="text-content">
        <img src="./img/smart-chat.png" alt="" />
        <p></p>
      </div>`;
    const botMsg = botDiv.querySelector("p");
    botMsg.textContent = botText;

    chatBox.append(userDiv, botDiv);
    this.main.appendChild(chatBox);
    this.scrollToBottom();

    return { botMsg, botDiv };
  }
}

class ChatHandler {
  constructor() {
    this.API_KEY = "GEMINI_API_KEY"; // Replace with your key for local testing

    this.ai = new GoogleGenAI({
      apiKey: this.API_KEY,
    });

    this.ui = new ChatUI();
    this.isSending = false;
  }

  init() {
    this.ui.form.addEventListener("submit", (event) => {
      event.preventDefault();
      this.handleSend();
    });
  }

  async handleSend() {
    if (this.isSending) return;

    const userInput = this.ui.prompt.value.trim();
    if (!userInput) return;

    if (!this.API_KEY || this.API_KEY === "GEMINI_API_KEY") {
      const { botMsg, botDiv } = this.ui.createChatBox(userInput, "");

      botDiv.classList.remove("is-loading");
      botDiv.classList.add("is-error");
      botMsg.textContent = "Gemini API key is not configured.";

      this.ui.prompt.value = "";
      return;
    }

    this.isSending = true;
    this.ui.sendBtn.disabled = true;
    this.ui.prompt.disabled = true;
    this.ui.prompt.value = "";

    const { botMsg, botDiv } = this.ui.createChatBox(userInput);

    try {
      const reply = await this.getResponse(userInput);
      botMsg.textContent = reply;
    } catch (error) {
      console.error("Gemini error:", error);

      botDiv.classList.add("is-error");
      botMsg.textContent =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";
    } finally {
      botDiv.classList.remove("is-loading");
      this.isSending = false;

      this.ui.sendBtn.disabled = false;
      this.ui.prompt.disabled = false;
      this.ui.prompt.focus();

      this.ui.scrollToBottom();
    }
  }

  async getResponse(userInput) {
    const response = await this.ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userInput,
    });

    const reply = response.text;

    if (!reply || !reply.trim()) {
      throw new Error("Gemini returned an empty response. Please try again.");
    }

    return reply;
  }
}

function startChatApp() {
  try {
    const chatApp = new ChatHandler();
    chatApp.init();
  } catch (error) {
    console.error("Chat initialization failed:", error);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startChatApp);
} else {
  startChatApp();
}
