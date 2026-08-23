(function () {

  if (document.getElementById('ai-widget-host')) return;

  const scriptTag = document.currentScript;
  const WEBHOOK_CHAT = scriptTag?.getAttribute('data-webhook-chat') || "http://localhost:5678/webhook-test/7dd793aa-34b8-4a12-bfa1-cd9920f8f81e";
  
  const offsetX = scriptTag?.getAttribute('data-offset-x') || '20px';
  const offsetY = scriptTag?.getAttribute('data-offset-y') || '20px';

  const drawerTop = `calc(${offsetY} + 50px)`;

  const host = document.createElement('div');
  host.id = 'ai-widget-host';

  host.style.cssText = `position: fixed !important; bottom: ${offsetY} !important; right: ${offsetX} !important; z-index: 2147483647 !important;`;
  document.body.appendChild(host);

  const shadow = host.attachShadow({ mode: 'open' });

  const style = document.createElement('style');
  style.textContent = `
    :host {
      font-family: Arial, Helvetica, sans-serif;
    }
    
    #button {
           padding: 14px 14px;
            border: none;
            border-radius: 19px;
            cursor: pointer;
            background-color: rgb(61, 60, 60);
            font-style: initial;
            color: rgb(248, 232, 202);
            font-weight: bolder;
            box-shadow: 0px 1px 13px rgb(247, 236, 215);
            float: right;
            
      transition: background-color 0.3s, transform 0.1s;
    }
    
    #button:active {
      background-color: rgb(247, 236, 215);
      text-shadow: 3px 3px 4px rgba(255,255,255,255);
      box-shadow: 0px 1px 13px rgb(247, 236, 215);
      transform: translate(1px, 3px);
    }

    #div2 {
      display: flex;
      visibility: hidden;
      border: 1px solid rgb(184, 190, 166);
      width: 380px;
      max-width: calc(100vw - 40px);
      height: 550px;
      max-height: calc(100vh - 100px);
      overflow-y: auto;
      background-color: rgb(32, 32, 34);
      border-radius: 20px;
      flex-direction: column;
      gap: 20px;
      padding: 20px;
      box-sizing: border-box;
      position: fixed;
      bottom: calc(${offsetY} + 50px);
      right: ${offsetX};
      box-shadow: 0 0px 20px rgba(255,255,255);
    }

    @keyframes slideIn {
      0% { transform: translateX(500px); opacity: 0; }
      100% { transform: translateX(0px); opacity: 1; }
    }

    #input {
      font-family: inherit;
      min-height: 8vh;
      margin-top: auto;
      color: white;
      background-color: rgb(23, 23, 25);
      border: none;
      border-radius: 17px;
      width: 100%;
      box-sizing: border-box;
      padding: 10px;
      overflow-y: auto;
      margin-bottom: 0px;
      resize: none;
    }

    #disclaimer {
      font-family: inherit;
      font-size: 11px;
      color: rgba(255, 255, 255, 0.5);
      text-align: center;
      margin-top: -8px;
      margin-bottom: 0px;
    }

    #input:hover {
      animation: glow 2s infinite alternate;
    }

    @keyframes glow {
      100% { box-shadow: 0px 0px 55px purple; }
    }

    #input::-webkit-scrollbar { width: 6px; }
    #input::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,0.3);
      border-radius: 10px;
    }

    #div2::-webkit-scrollbar { width: 6px; }
    #div2::-webkit-scrollbar-track { background: black; }
    #div2::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,0.3);
      border-radius: 10px;
    }

    .animate-me {
      animation: slideIn 0.5s ease-out forwards;
    }
    
    .User-output {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      max-width: 75%;
      padding: 10px 16px;
      border-radius: 20px;
      background-color: rgba(105, 111, 117, 0.281);
      color: white;
      font-weight: 500;
      align-self: flex-end;
      height: auto;
      overflow-wrap: break-word;
      line-height: 1.4;
      margin-bottom: 10px;
      animation: slideUp 0.3s ease-out forwards;
      word-break: break-word; 
      overflow-x: hidden;
    }

    .AI-output {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      max-width: 75%;
      padding: 10px 16px;
      border-radius: 20px;
      background-color: rgba(105, 111, 117, 0.281);
      color: white;
      font-weight: 500;
      align-self: flex-start;
      height: auto;
      overflow-wrap: break-word;
      line-height: 1.4;
      margin-bottom: 10px;
      animation: slideUp 0.3s ease-out forwards;
    }

    #div3 {
      border: none;
      width: 100%;
      height: auto;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
    }

    @keyframes glowingthingy {
      100% { box-shadow: 0px 0px 60px purple; }
    }
    @keyframes glowingthing {
      100% { box-shadow: 0px 0px 60px rgb(57, 183, 226); }
    }

    .glowingthingy {
      animation: glowingthingy 2s infinite alternate;
    }
    
    @keyframes slideOut {
      0% { transform: translateX(0); opacity: 1; }
      100% { transform: translateX(500px); opacity: 0; }
    }

    .slide-out-me {
      animation: slideOut 0.5s ease-in forwards;
    }

    @keyframes slideUp {
      0% { transform: translateY(20px); opacity: 0; }
      100% { transform: translateY(0px); opacity: 1; }
    }

    @keyframes sldUp {
      0% { transform: translateX(0px); opacity: 1; }
      100% { transform: translateX(240px); opacity: 0; }
    }

    @keyframes slide {
      0% { transform: translateX(0px); }
      100% { transform: translateX(20px); }
    }

    #thinkingone {
      animation: slide 0.8s ease-out infinite forwards, glowingthing 2s infinite alternate;
    }

    #thinkingone.finishing {
      animation: sldUp 0.5s ease-out forwards, glowingthing 0.5s infinite alternate;
    }
            
    @keyframes glowingtingy {
      0% { box-shadow: 0px 0px 0px transparent; }
      100% { box-shadow: 0px 0px 60px rgb(255, 34, 34); }
    }

    .glowingtingy {
      animation: glowingtingy 4s infinite alternate; 
    }

    @keyframes glowytingy {
      0% { box-shadow: 0px 0px 60px transparent; }
      100% { box-shadow: 0px 0px 60px rgb(31, 243, 31); }
    }

    .glowytingy {
      animation: glowytingy 2s infinite alternate;
    }
    textarea:focus {
  
  outline: none; 
  
  border-color: #3b82f6; 
  
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.6); 
  
  transition: box-shadow 0.2s ease-in-out, border-color 0.2s ease-in-out;
  `;

  // Inject DOM Elements inside Shadow Root
  const container = document.createElement('div');
  container.innerHTML = `
    <div id="div2">
      <div id="div3"></div>
      <textarea id="input" placeholder="Ask something about the site here...(Alt + c to clear)" maxlength="500"></textarea>
      <div id="disclaimer">AI might make mistakes</div>
    </div>
     <button id="button" aria-label="Open Chat">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
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
      setTimeout(() => trying.classList.remove('animate-me'), 500);
    } else {
      trying.classList.remove('animate-me');
      trying.classList.add('slide-out-me');
      setTimeout(() => {
        if (clicks % 2 !== 0) trying.style.visibility = 'hidden';
      }, 500);
      setTimeout(() => trying.classList.remove('slide-out-me'), 500);
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
      trying.scrollTo({ top: trying.scrollHeight, behavior: 'smooth' });

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
        trying.scrollTo({ top: trying.scrollHeight, behavior: 'smooth' });
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
        }, 500);

        setTimeout(() => trying.classList.remove('slide-out-me'), 500);
      }
    }
  });
})();
