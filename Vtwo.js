(function () {

  if (document.getElementById('ai-widget-host')) return;

  const scriptTag = document.currentScript;
  const WEBHOOK_CHAT = scriptTag?.getAttribute('data-webhook-chat') || "http://localhost:5678/webhook-test/7dd793aa-34b8-4a12-bfa1-cd9920f8f81e";
  
  const offsetX = scriptTag?.getAttribute('data-offset-x') || '20px';
  const offsetY = scriptTag?.getAttribute('data-offset-y') || '20px';

  const host = document.createElement('div');
  host.id = 'ai-widget-host';

  host.style.cssText = `
    position: fixed !important; 
    bottom: ${offsetY} !important; 
    right: ${offsetX} !important; 
    z-index: 2147483647 !important;
  `;
  document.body.appendChild(host);

  const shadow = host.attachShadow({ mode: 'open' });

  const style = document.createElement('style');
  style.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');

    :host {
      font-family: 'Plus Jakarta Sans', sans-serif;
    }
    
    /* MODERN FLOATING BUTTON */
    #button {
      border: 1px solid rgba(255, 255, 255, 0.15);
      outline: none;
      border-radius: 30px;
      padding: 0 22px;
      height: 48px;
      background: linear-gradient(135deg, #1e1e24 0%, #0a0a0c 100%);
      color: #ffffff;
      cursor: pointer;
      font-weight: 600;
      font-size: 14px;
      letter-spacing: 0.3px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      box-shadow: 0 8px 24px -4px rgba(0, 0, 0, 0.6), 0 2px 6px -1px rgba(0, 0, 0, 0.3);
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      position: relative;
      float: right;
    }
    
    #button:hover {
      background: linear-gradient(135deg, #2a2a32 0%, #121215 100%);
      border-color: rgba(255, 255, 255, 0.3);
      box-shadow: 0 12px 28px -4px rgba(0, 0, 0, 0.7), 0 0 15px rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
    }

    #button:active {
      transform: translateY(1px);
      box-shadow: 0 4px 12px -2px rgba(0, 0, 0, 0.5);
    }

    /* DRAWER & ANIMATIONS FIX */
    #div2 {
      display: flex;
      opacity: 0;
      pointer-events: none;
      border: 1px solid rgba(255, 255, 255, 0.1);
      width: 380px;
      max-width: calc(100vw - 40px);
      height: 550px;
      max-height: calc(100vh - 120px);
      overflow-y: auto;
      background-color: #0d0d10;
      border-radius: 20px;
      flex-direction: column;
      gap: 20px;
      padding: 20px;
      box-sizing: border-box;
      position: absolute;
      bottom: 64px;
      right: 0;
      box-shadow: 0 20px 40px rgba(0,0,0,0.6);
      transform-origin: bottom right;
      transform: translateY(20px) scale(0.95);
      transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }

    /* ACTIVE OPEN STATE */
    #div2.open {
      opacity: 1;
      pointer-events: auto;
      transform: translateY(0) scale(1);
    }

    #input {
      min-height: 50px;
      margin-top: auto;
      color: white;
      background-color: #1a1a20;
      border: 1px solid rgba(255,255,255,0.08);
      outline: none;
      border-radius: 14px;
      width: 100%;
      box-sizing: border-box;
      padding: 12px 14px;
      overflow-y: auto;
      resize: none;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 14px;
      transition: border-color 0.2s;
    }

    #input:focus {
      border-color: rgba(255, 255, 255, 0.25);
    }

    #input::-webkit-scrollbar, #div2::-webkit-scrollbar { width: 4px; }
    #input::-webkit-scrollbar-thumb, #div2::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,0.2);
      border-radius: 10px;
    }

    .User-output {
      max-width: 80%;
      padding: 10px 16px;
      border-radius: 16px 16px 2px 16px;
      background-color: #2a2b36;
      color: white;
      font-size: 14px;
      font-weight: 500;
      align-self: flex-end;
      overflow-wrap: break-word;
      line-height: 1.4;
      margin-bottom: 10px;
      animation: slideUp 0.25s ease-out forwards;
    }

    .AI-output {
      max-width: 80%;
      padding: 10px 16px;
      border-radius: 16px 16px 16px 2px;
      background-color: #181920;
      border: 1px solid rgba(255,255,255,0.05);
      color: #e0e0e0;
      font-size: 14px;
      font-weight: 500;
      align-self: flex-start;
      overflow-wrap: break-word;
      line-height: 1.4;
      margin-bottom: 10px;
      animation: slideUp 0.25s ease-out forwards;
    }

    #div3 {
      border: none;
      width: 100%;
      display: flex;
      flex-direction: column;
    }

    @keyframes slideUp {
      0% { transform: translateY(10px); opacity: 0; }
      100% { transform: translateY(0px); opacity: 1; }
    }
  `;

  const container = document.createElement('div');
  container.innerHTML = `
    <div id="div2">
      <div id="div3"></div>
      <textarea id="input" placeholder="Ask something... (Alt + C to clear)" maxlength="500"></textarea>
    </div>
    <button id="button">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
      <span>Chat</span>
    </button>
  `;

  shadow.appendChild(style);
  shadow.appendChild(container);

  const button = shadow.getElementById('button');
  const trying = shadow.getElementById('div2');
  const input = shadow.getElementById('input');
  const div3 = shadow.getElementById('div3');

  let isOpen = false;

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
        body: JSON.stringify({ session_id: sessionId, message: userMessage })
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      return data.text || data.ai_message?.text || "Sorry, I couldn't process that.";
    } catch (error) {
      return "Connection error. Please try again.";
    }
  }

  function toggleChat() {
    isOpen = !isOpen;
    if (isOpen) {
      trying.classList.add('open');
      setTimeout(() => input.focus(), 250);
    } else {
      trying.classList.remove('open');
    }
  }

  button.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleChat();
  });

  input.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const usrInput = input.value;
      if (usrInput.trim() === "" || input.disabled) return;

      input.disabled = true;

      let UsrOutput = document.createElement('div');
      UsrOutput.className = 'User-output';
      UsrOutput.textContent = usrInput;
      div3.appendChild(UsrOutput);

      input.value = '';
      trying.scrollTo({ top: trying.scrollHeight, behavior: 'smooth' });

      let thinking = document.createElement('div');
      thinking.className = 'AI-output';
      thinking.textContent = 'Thinking...';
      div3.appendChild(thinking);

      let AImsg = await SendToN8N(usrInput);
      thinking.remove();

      let AIOutput = document.createElement('div');
      AIOutput.className = 'AI-output';
      AIOutput.textContent = AImsg;
      div3.appendChild(AIOutput);

      input.disabled = false;
      trying.scrollTo({ top: trying.scrollHeight, behavior: 'smooth' });
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
    if (isOpen) {
      const path = e.composedPath();
      if (!path.includes(trying) && !path.includes(button)) {
        toggleChat();
      }
    }
  });
})();
