(function () {
  if (document.getElementById('ai-widget-host')) return;

  const scriptTag = document.currentScript;
  const WEBHOOK_CHAT = scriptTag?.getAttribute('data-webhook-chat') || "http://localhost:5678/webhook-test/7dd793aa-34b8-4a12-bfa1-cd9920f8f81e";
  
  const offsetX = scriptTag?.getAttribute('data-offset-x') || '20px';
  const offsetY = scriptTag?.getAttribute('data-offset-y') || '20px';

  const drawerTop = `calc(${offsetY} + 60px)`;

  const host = document.createElement('div');
  host.id = 'ai-widget-host';

  host.style.cssText = `position: fixed !important; bottom: ${offsetY} !important; right: ${offsetX} !important; z-index: 2147483647 !important;`;
  document.body.appendChild(host);

  const shadow = host.attachShadow({ mode: 'open' });

  const style = document.createElement('style');
  style.textContent = `
    :host {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }
    
    #button {
      border: none;
      border-radius: 50px;
      padding: 12px 20px;
      height: 48px;
      background: linear-gradient(135deg, #36d1b7 0%, #2bb29b 100%);
      color: white;
      cursor: pointer;
      font-weight: 600;
      font-size: 14px;
      box-shadow: 0 8px 24px rgba(54, 209, 183, 0.35);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    #button:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 28px rgba(54, 209, 183, 0.45);
    }
    
    #button:active {
      transform: translateY(1px);
      box-shadow: 0 4px 12px rgba(54, 209, 183, 0.25);
    }

    #div2 {
      display: flex;
      visibility: hidden;
      border: 1px solid rgba(255, 255, 255, 0.1);
      width: 380px;
      max-width: calc(100vw - 40px);
      height: 580px;
      max-height: calc(100vh - 120px);
      background: #0f1115;
      border-radius: 20px;
      flex-direction: column;
      padding: 16px;
      box-sizing: border-box;
      position: fixed;
      bottom: calc(${offsetY} + 60px);
      right: ${offsetX};
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(12px);
    }

    #div3 {
      border: none;
      width: 100%;
      flex-grow: 1;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      padding-right: 4px;
    }

    .input-container {
      margin-top: auto;
      display: flex;
      flex-direction: column;
      gap: 6px;
      width: 100%;
    }

    #input {
      min-height: 52px;
      color: #ffffff;
      background-color: #1a1d24;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      width: 100%;
      box-sizing: border-box;
      padding: 12px 14px;
      font-size: 13px;
      overflow-y: auto;
      resize: none;
      outline: none;
      transition: border-color 0.2s;
    }

    #input:focus {
      border-color: rgba(54, 209, 183, 0.5);
    }

    #input:hover {
      animation: glow 3s infinite alternate;
    }

    .disclaimer-text {
      font-size: 10px;
      color: rgba(255, 255, 255, 0.4);
      text-align: center;
      margin: 0;
      user-select: none;
    }

    @keyframes glow {
      100% { box-shadow: 0px 0px 30px rgba(168, 85, 247, 0.4); }
    }

    #input::-webkit-scrollbar, #div3::-webkit-scrollbar { width: 4px; }
    #input::-webkit-scrollbar-thumb, #div3::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2);
      border-radius: 10px;
    }

    @keyframes slideIn {
      0% { transform: translateY(20px) scale(0.95); opacity: 0; }
      100% { transform: translateY(0) scale(1); opacity: 1; }
    }

    @keyframes slideOut {
      0% { transform: translateY(0) scale(1); opacity: 1; }
      100% { transform: translateY(20px) scale(0.95); opacity: 0; }
    }

    .animate-me { animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .slide-out-me { animation: slideOut 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

    .User-output {
      max-width: 80%;
      padding: 10px 14px;
      border-radius: 16px 16px 2px 16px;
      background: #2bb29b;
      color: #ffffff;
      font-size: 13px;
      font-weight: 500;
      align-self: flex-end;
      overflow-wrap: break-word;
      line-height: 1.4;
      margin-bottom: 12px;
      animation: slideUp 0.25s ease-out forwards;
      word-break: break-word; 
    }

    .AI-output {
      max-width: 80%;
      padding: 10px 14px;
      border-radius: 16px 16px 16px 2px;
      background: #1a1d24;
      border: 1px solid rgba(255, 255, 255, 0.05);
      color: #e2e8f0;
      font-size: 13px;
      align-self: flex-start;
      overflow-wrap: break-word;
      line-height: 1.4;
      margin-bottom: 12px;
      animation: slideUp 0.25s ease-out forwards;
    }

    @keyframes glowingthingy { 100% { box-shadow: 0px 0px 40px rgba(168, 85, 247, 0.5); } }
    @keyframes glowingthing { 100% { box-shadow: 0px 0px 30px rgba(57, 183, 226, 0.5); } }

    .glowingthingy { animation: glowingthingy 2s infinite alternate; }

    @keyframes slideUp {
      0% { transform: translateY(10px); opacity: 0; }
      100% { transform: translateY(0px); opacity: 1; }
    }

    @keyframes sldUp {
      0% { transform: translateX(0px); opacity: 1; }
      100% { transform: translateX(240px); opacity: 0; }
    }

    @keyframes slide {
      0% { transform: translateX(0px); }
      100% { transform: translateX(10px); }
    }

    #thinkingone {
      animation: slide 0.8s ease-out infinite forwards, glowingthing 2s infinite alternate;
    }

    #thinkingone.finishing {
      animation: sldUp 0.5s ease-out forwards, glowingthing 0.5s infinite alternate;
    }
            
    @keyframes glowingtingy {
      0% { box-shadow: 0px 0px 0px transparent; }
      100% { box-shadow: 0px 0px 40px rgba(255, 34, 34, 0.6); }
    }

    .glowingtingy { animation: glowingtingy 4s infinite alternate; }

    @keyframes glowytingy {
      0% { box-shadow: 0px 0px 0px transparent; }
      100% { box-shadow: 0px 0px 40px rgba(31, 243, 31, 0.6); }
    }

    .glowytingy { animation: glowytingy 2s infinite alternate; }
  `;

  const container = document.createElement('div');
  container.innerHTML = `
    <div id="div2">
      <div id="div3"></div>
      <div class="input-container">
        <textarea id="input" placeholder="Ask something about the site... (Alt + C to clear)" maxlength="500"></textarea>
        <p class="disclaimer-text">AI can make mistakes. Verify important info.</p>
      </div>
    </div>
    <button id="button">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
      <span>Chat AI</span>
    </button>
  `;

  shadow.appendChild(style);
  shadow.appendChild(container);

  const button = shadow.getElementById('button');
  const trying = shadow.getElementById('div2');
  const input = shadow.getElementById('input');
  const div3 = shadow.getElementById('div3');

  let clicks = 1;
  let count = 0;

  const SESSION_KEY = 'chat_session_id';
  const TIMESTAMP_KEY = 'chat_session_time';
  const MAX_AGE = 24 * 60 * 60 * 1000;

  let sessionId = localStorage.getItem(SESSION_KEY);
  let sessionTime = localStorage.getItem(TIMESTAMP_KEY);
  const now = Date.now();

  if (!sessionId || !sessionTime || (now - Number(sessionTime) > MAX_AGE)) {
    sessionId = 'sess_' + Math.random().toString(36).substring(2, 11);
    localStorage.setItem(SESSION_KEY, sessionId);
    localStorage.setItem(TIMESTAMP_KEY, now.toString());
  }

  async function SendToN8N(userMessage) {
    try {
      const response = await fetch(WEBHOOK_CHAT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          message: userMessage
        })
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      return data.text || data.ai_message?.text || "Sorry, I couldn't process that.";
    } catch (error) {
      console.error("n8n Fetch Error:", error);
      return "Connection error. Please try again.";
    }
  }

  button.addEventListener('click', () => {
    clicks++;
    if (clicks % 2 === 0) {
      trying.classList.remove('slide-out-me');
      trying.classList.add('animate-me');
      trying.style.visibility = 'visible';
      setTimeout(() => trying.classList.remove('animate-me'), 300);
    } else {
      trying.classList.remove('animate-me');
      trying.classList.add('slide-out-me');
      setTimeout(() => {
        if (clicks % 2 !== 0) trying.style.visibility = 'hidden';
      }, 300);
      setTimeout(() => trying.classList.remove('slide-out-me'), 300);
    }
  });

  input.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const usrInput = input.value;
      if (usrInput.trim() === "" || input.disabled) return;

      input.disabled = true;
      count++;
      if (count % 5 === 0 || usrInput.length > 30) {
        trying.classList.add('glowingthingy');
        setTimeout(() => trying.classList.remove('glowingthingy'), 4000);
      }

      let UsrOutput = document.createElement('div');
      UsrOutput.className = 'User-output';
      UsrOutput.textContent = usrInput;
      div3.appendChild(UsrOutput);

      input.value = '';
      div3.scrollTo({ top: div3.scrollHeight, behavior: 'smooth' });

      try {
        let thinking = document.createElement('div');
        thinking.classList.add('AI-output');
        thinking.id = 'thinkingone';
        thinking.textContent = 'Thinking...';
        div3.appendChild(thinking);

        let AImsg = await SendToN8N(usrInput);
        let thinkingRemove = shadow.getElementById('thinkingone');

        if (thinkingRemove) thinkingRemove.classList.add('finishing');

        setTimeout(() => {
          if (thinkingRemove) thinkingRemove.remove();

          let emailMatch = AImsg.match(/Email\d+/);
          if (emailMatch) {
            trying.classList.add('glowytingy');
            setTimeout(() => trying.classList.remove('glowytingy'), 4000);
            AImsg = AImsg.replace(emailMatch, "").trim();
          }

          let AIOutput = document.createElement('div');
          AIOutput.className = 'AI-output';
          AIOutput.textContent = AImsg;
          div3.appendChild(AIOutput);

          if (AImsg.trim() === "Can't help with that lil bro") {
            trying.classList.add('glowingtingy');
            setTimeout(() => trying.classList.remove('glowingtingy'), 8000);
          }
        }, 700);
      } finally {
        setTimeout(() => { input.disabled = false; }, 700);
        div3.scrollTo({ top: div3.scrollHeight, behavior: 'smooth' });
      }
    }
  });

  window.addEventListener('keydown', (f) => {
    if (f.altKey && f.code === 'KeyC') {
      f.preventDefault();

      if (div3) div3.innerHTML = '';
      if (input) input.value = '';

      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(TIMESTAMP_KEY);

      sessionId = 'sess_' + Math.random().toString(36).substring(2, 11);
      localStorage.setItem(SESSION_KEY, sessionId);
      localStorage.setItem(TIMESTAMP_KEY, Date.now().toString());
    }
  });

  window.addEventListener('click', (e) => {
    if (clicks % 2 === 0) {
      const path = e.composedPath();
      if (!path.includes(trying) && !path.includes(button)) {
        clicks++;
        trying.classList.remove('animate-me');
        trying.classList.add('slide-out-me');

        setTimeout(() => {
          if (clicks % 2 !== 0) trying.style.visibility = 'hidden';
        }, 300);

        setTimeout(() => trying.classList.remove('slide-out-me'), 300);
      }
    }
  });
})();
