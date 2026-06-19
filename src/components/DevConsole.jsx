import React, { useState, useEffect, useRef } from 'react';

export default function DevConsole({
  active,
  onClose,
  onThemeChange,
  onOtaTrigger,
  onChatFABToggle,
  audioControls,
  autoRunCommand,
  onAutoRunComplete,
  skipBoot
}) {
  const { playClick, playBoot } = audioControls;
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [inputVal, setInputVal] = useState("");
  const [logs, setLogs] = useState([]);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isAiSession, setIsAiSession] = useState(false);
  const [aiHistory, setAiHistory] = useState([]);
  const [placeholder, setPlaceholder] = useState("Type a command...");
  const [promptPrefix, setPromptPrefix] = useState("visitor@om.dev:~$");
  const [telemetry, setTelemetry] = useState(null);

  // Passcode hacking minigame states
  const [isGameActive, setIsGameActive] = useState(false);
  const [gameSecret, setGameSecret] = useState("");
  const [gameAttempts, setGameAttempts] = useState(0);

  const termBodyRef = useRef(null);
  const inputRef = useRef(null);
  const telemetryIntervalRef = useRef(null);

  // Initialize and print welcome message
  useEffect(() => {
    if (active) {
      document.body.style.overflow = "hidden";
      
      if (skipBoot) {
        sessionStorage.setItem('terminal_booted', 'true');
        setIsInstalling(false);
        setLogs([]);
        setPlaceholder("Type a command...");
        if (inputRef.current) inputRef.current.focus();
        return;
      }
      
      const booted = sessionStorage.getItem('terminal_booted') === 'true';
      if (!booted) {
        setLogs([]);
        setIsInstalling(true);
        setPlaceholder("Booting system...");
        
        const bootSequence = [
          { text: "Resolving shell host variables...", done: "Host resolved (om.dev:5430)." },
          { text: "Accessing encrypted session ports...", done: "Secure port 443 handshake complete." },
          { text: "Loading profile configurations...", done: "Configs parsed (index.html:1.3.0)." },
          { text: "Initializing perspective engine...", done: "Canvas particles matrix calibrated." },
          { text: "Connecting to OTA build servers...", done: "Linked to origin/main server." }
        ];

        let currentStep = 0;
        const runStep = () => {
          if (currentStep < bootSequence.length) {
            const step = bootSequence[currentStep];
            setLogs(prev => [...prev, { type: 'loader', activeText: step.text, doneText: '' }]);
            
            setTimeout(() => {
              setLogs(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { type: 'success', text: step.done };
                return updated;
              });
              currentStep++;
              runStep();
            }, 450);
          } else {
            sessionStorage.setItem('terminal_booted', 'true');
            setTimeout(() => {
              setIsInstalling(false);
              setPlaceholder("Type a command...");
              printWelcome();
              if (inputRef.current) inputRef.current.focus();
            }, 200);
          }
        };
        
        runStep();
      } else {
        // Quick Recovery Loader (Subsequent opens)
        setIsInstalling(true);
        setPlaceholder("Accessing terminal...");
        setLogs([{ type: 'recovery_loader' }]);

        setTimeout(() => {
          setIsInstalling(false);
          setPlaceholder("Type a command...");
          setLogs([]);
          printWelcome();
          if (inputRef.current) inputRef.current.focus();
        }, 500);
      }
    } else {
      document.body.style.overflow = "";
      if (telemetryIntervalRef.current) {
        clearInterval(telemetryIntervalRef.current);
        telemetryIntervalRef.current = null;
      }
      setTelemetry(null);
    }
    
    return () => {
      if (telemetryIntervalRef.current) clearInterval(telemetryIntervalRef.current);
    };
  }, [active, skipBoot]);

  // Scroll terminal logs container to bottom when logs update
  useEffect(() => {
    if (termBodyRef.current) {
      termBodyRef.current.scrollTop = termBodyRef.current.scrollHeight;
    }
  }, [logs, telemetry]);

  const printWelcome = () => {
    setLogs(prev => [
      ...prev,
      { type: 'html', html: `<span class="welcome-ascii-log" style="font-family: var(--font-display); font-size: 2.2rem; font-weight: 900; letter-spacing: -0.04em; text-transform: uppercase;">OM.DEV KERNEL_</span>` },
      { type: 'html', html: `<div class="terminal-log-row" style="opacity: 0.6; margin-bottom: 0.5rem; font-family: monospace;">OM.DEV INTERACTIVE SHELL [v1.3.0] // PERSISTENT SESSION</div>` },
      { type: 'html', html: `<div class="terminal-log-row" style="line-height: 1.6;">Welcome, guest visitor! Explore my digital portfolio archive indices natively through direct instruction blocks.</div>` },
      { type: 'html', html: `<div class="notion-style-callout terminal-log-row" style="border-left: 2.5px solid var(--term-accent); padding-left: 1rem; margin: 0.5rem 0; opacity: 0.95;">Type <strong style="color: var(--term-accent);">help</strong> to execute a structured array of all available core diagnostics commands.</div>` }
    ]);
  };

  const projectDB = {
    strophe: {
      title: "Strophe AI",
      status: "LIVE",
      year: "2026",
      tech: "Gen-AI, studied",
      tags: "AI, Full-Stack, Affordable",
      desc: "AI-Powered Full-Stack Platform. Affordable, accessible Gen-AI workspace.",
      url: "https://strophe.abacusai.app"
    },
    clarimap: {
      title: "Clarimap",
      status: "UPCOMING",
      year: "2026",
      tech: "Real-time Map, JS",
      tags: "Logic visualizer, Universal Input, Instant Mapping",
      desc: "An AI-powered visualization engine that instantly translates complex code, system architectures, and study concepts into interactive diagrams.",
      url: "https://clarimap.edgeone.app"
    },
    rivelo: {
      title: "Rivelo AI",
      status: "LIVE",
      year: "2026",
      tech: "Dashboard, Personas",
      tags: "Dashboard, Frontend, Personas",
      desc: "Rivelo is a high-performance AI workspace that features four distinct 'personas' tailored for general tasks, speed, coding, and complex reasoning.",
      url: "https://riveloai.edgeone.app"
    },
    llm: {
      title: "Custom LLM Family",
      status: "UPCOMING",
      year: "2025-2026",
      tech: "Frontier Reasoning",
      tags: "Custom Models, Reasoning, M1-Strophe1, M2-Antistrophe, M3-Strophe Aion",
      desc: "Strophe is a custom-built LLM family featuring a reasoning-first architecture and bespoke tokenizer. It scales from the edge-optimized Strophe 1 to the frontier-grade Aion.",
      url: "https://strophe.edgeone.app"
    },
    sundaycups: {
      title: "Sunday Cups",
      status: "LIVE",
      year: "2026",
      tech: "Premium UI Menu",
      tags: "Premium Design, Frontend, Demo-Site",
      desc: "Sunday Cups — A premium UI/UX coffee showcase blending intentional white space with editorial design to redefine how we discover the 'perfect pour.'",
      url: "https://sundaycups.netlify.app"
    },
    codecamy: {
      title: "Codecamy",
      status: "LIVE",
      year: "2026",
      tech: "High-End Branding",
      tags: "Premium Design, Frontend, Demo-Site",
      desc: "Codecamy — A sleek UI/UX project that emphasizes visual clarity and a bold digital identity, crafted to deliver an immersive and intuitive user journey for developers.",
      url: "https://codecamy.edgeone.app"
    },
    prompchitect: {
      title: "Prompchitect",
      status: "LIVE",
      year: "2026",
      tech: "350+ API Router",
      tags: "Prompt Engineering, Visual Hierarchy",
      desc: "Promchitect — Advanced AI Orchestration Dashboard featuring a dynamic Model Control system with access to 350+ LLMs via OpenRouter, wrapped in a sophisticated interface.",
      url: "https://prompchitect.edgeone.app"
    },
    muaazfoods: {
      title: "Muaazfoods",
      status: "LIVE",
      year: "2026",
      tech: "Culinary Menu UX",
      tags: "Premium Design, Frontend, Demo-Site, Clean Minimalism",
      desc: "Muaaz Foods — A Culinary Editorial Experience. A premium, typography-driven digital menu designed with a 'Volume I' editorial concept.",
      url: "https://muaazfoodz.edgeone.app"
    }
  };

  const projectCardsDB = {
    'Strophe AI': { url: 'https://strophe.abacusai.app', desc: 'All-in-one AI companion', status: 'NEW', img: '/assets/strophe.png' },
    'Clarimap': { url: 'https://clarimap.edgeone.app', desc: 'AI visualization engine', status: 'Upcoming', img: '/videos/clarimapvideo.mp4' },
    'Rivelo AI': { url: 'https://riveloai.edgeone.app', desc: 'High-performance AI workspace', status: 'LIVE', img: '/videos/rivelovideo.mp4' },
    'Custom LLM Family': { url: 'https://strophe.edgeone.app', desc: 'Custom reasoning models', status: 'Upcoming', img: '/assets/strophemodel.png' },
    'Sunday Cups': { url: 'https://sundaycups.netlify.app', desc: 'Premium UI/UX coffee showcase', status: 'UI-Design', img: '/assets/sundaycups.png' },
    'Codecamy': { url: 'https://codecamy.edgeone.app', desc: 'Sleek UI/UX education platform', status: 'UI-Design', img: '/assets/codecamy.png' },
    'Prompchitect': { url: 'https://prompchitect.edgeone.app', desc: 'Advanced AI orchestration dashboard', status: 'AI Tool', img: '/videos/prompchitectvideo.mp4' },
    'Muaazfoods': { url: 'https://muaazfoodz.edgeone.app', desc: 'Premium culinary digital menu', status: 'UI-Design', img: '/assets/muaazfoods.png' }
  };

  // ── locksbreaker hacking passcode minigame router ──
  const startHackingGame = () => {
    setIsGameActive(true);
    setGameAttempts(0);
    const digits = [];
    while (digits.length < 4) {
      const d = Math.floor(Math.random() * 10).toString();
      if (!digits.includes(d)) digits.push(d);
    }
    const secret = digits.join("");
    setGameSecret(secret);

    setPromptPrefix("hack@kernel:~$");
    setPlaceholder("Enter your 4-digit guess...");

    setLogs(prev => [
      ...prev,
      {
        type: 'html',
        html: `
<div style="font-family: monospace; border: 1.5px solid var(--term-border); background: rgba(0,0,0,0.06); padding: 16px; border-radius: 8px; line-height: 1.6; max-width: 460px; box-shadow: 3px 3px 0 var(--term-border); margin: 8px 0; color: var(--term-text);">
  <div style="color: #FF5F56; font-weight: bold; border-bottom: 1px dashed var(--term-border); padding-bottom: 6px; margin-bottom: 8px;">🔒 TERMINAL LOCKBREAKER PROTOCOL DEPLOYED</div>
  <div>Kernel encryption key generated. Bypassing security matrix...</div>
  <div>Decrypt the 4-digit passcode to override blockades.</div>
  <div style="margin: 8px 0; color: var(--term-accent); font-weight: bold;">[RULES] :</div>
  <div>- Code contains 4 unique digits (e.g. 1048)</div>
  <div>- Feedbacks show: <strong>Positional matches</strong> & <strong>Correct digits</strong></div>
  <div>- Type <span style="color: #FF5F56;">exit</span> to abort hacking stream.</div>
  <div style="margin-top: 10px; font-weight: bold; color: #27C93F;">Attempts Remaining: 6</div>
</div>`
      }
    ]);
  };

  const handleGameInput = (guess) => {
    const cleanGuess = guess.trim();
    
    if (cleanGuess.toLowerCase() === "exit" || cleanGuess.toLowerCase() === "quit") {
      setLogs(prev => [...prev, { type: 'error', text: `[LOCKBREAKER PROTOCOL TERMINATED] PASSCODE WAS: ${gameSecret}` }]);
      setIsGameActive(false);
      setPromptPrefix("visitor@om.dev:~$");
      setPlaceholder("Type a command...");
      return;
    }

    if (!/^\d{4}$/.test(cleanGuess)) {
      setLogs(prev => [...prev, { type: 'error', text: "ERROR: Passcode must be exactly 4 digits. Try again." }]);
      return;
    }

    const nextAttempts = gameAttempts + 1;
    setGameAttempts(nextAttempts);

    let correctPos = 0;
    let correctDigits = 0;

    for (let i = 0; i < 4; i++) {
      if (cleanGuess[i] === gameSecret[i]) {
        correctPos++;
      }
      if (gameSecret.includes(cleanGuess[i])) {
        correctDigits++;
      }
    }

    setLogs(prev => [
      ...prev,
      { type: 'text', text: `Guess #${nextAttempts}: ${cleanGuess}`, color: 'var(--term-accent)' },
      { type: 'text', text: `└─ 🟢 Positional Matches: ${correctPos} | 🟡 Correct Digits: ${correctDigits}`, color: 'var(--term-text)' }
    ]);

    if (correctPos === 4) {
      setLogs(prev => [
        ...prev,
        {
          type: 'html',
          html: `
<div style="font-family: monospace; border: 1.5px solid #27C93F; background: rgba(39, 201, 63, 0.1); padding: 12px; border-radius: 6px; color: #27C93F; font-weight: bold; margin-top: 8px;">
  🔓 SECURITY BYPASSED SUCCESSFULLY!
  <br>Access Granted to Local Environment Stack. Memory Core Unlocked.
</div>`
        }
      ]);
      setIsGameActive(false);
      setPromptPrefix("visitor@om.dev:~$");
      setPlaceholder("Type a command...");
      playBoot();
      return;
    }

    if (nextAttempts >= 6) {
      setLogs(prev => [
        ...prev,
        {
          type: 'html',
          html: `
<div style="font-family: monospace; border: 1.5px solid #FF5F56; background: rgba(255, 95, 86, 0.1); padding: 12px; border-radius: 6px; color: #FF5F56; font-weight: bold; margin-top: 8px;">
  💀 DECRYPTION PROTOCOL FAILED - MATRIX LOCKED
  <br>PASSCODE SECURED: ${gameSecret}
</div>`
        }
      ]);
      setIsGameActive(false);
      setPromptPrefix("visitor@om.dev:~$");
      setPlaceholder("Type a command...");
      return;
    }

    setPlaceholder(`Passcode guess... (${6 - nextAttempts} left)`);
  };

  // ── matrix screensaver ──
  const startMatrixScreensaver = () => {
    const msCanvas = document.createElement('canvas');
    msCanvas.id = 'matrix-screensaver';
    msCanvas.style.cssText = "position: fixed; inset: 0; width: 100vw; height: 100vh; background: #000; z-index: 1000000; cursor: pointer;";
    document.body.appendChild(msCanvas);

    const msCtx = msCanvas.getContext('2d');
    let width = msCanvas.width = window.innerWidth;
    let height = msCanvas.height = window.innerHeight;

    const katakana = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const alphabet = katakana.split("");

    const fontSize = 16;
    const columns = width / fontSize;

    const rainDrops = [];
    for (let x = 0; x < columns; x++) {
      rainDrops[x] = 1;
    }

    let animationId;

    const drawMatrix = () => {
      msCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      msCtx.fillRect(0, 0, width, height);

      msCtx.fillStyle = '#22c55e';
      msCtx.font = fontSize + 'px monospace';

      for (let i = 0; i < rainDrops.length; i++) {
        const text = alphabet[Math.floor(Math.random() * alphabet.length)];
        msCtx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

        if (rainDrops[i] * fontSize > height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }
        rainDrops[i]++;
      }

      msCtx.fillStyle = '#fff';
      msCtx.font = '14px sans-serif';
      msCtx.fillText('[ Press ESC or Click to exit screensaver ]', 20, 30);
    };

    const runLoop = () => {
      drawMatrix();
      animationId = requestAnimationFrame(runLoop);
    };

    runLoop();

    const cleanup = () => {
      cancelAnimationFrame(animationId);
      msCanvas.remove();
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('resize', handleResize);
    };

    const handleKey = (e) => {
      if (e.key === 'Escape') cleanup();
    };

    const handleResize = () => {
      width = msCanvas.width = window.innerWidth;
      height = msCanvas.height = window.innerHeight;
      const newCols = width / fontSize;
      for (let x = rainDrops.length; x < newCols; x++) {
        rainDrops[x] = 1;
      }
    };

    msCanvas.addEventListener('click', cleanup);
    window.addEventListener('keydown', handleKey);
    window.addEventListener('resize', handleResize);
  };

  // ── real-time system performance telemetry dashboard ──
  const startTelemetryStream = () => {
    setIsInstalling(true);
    setLogs(prev => [...prev, { type: 'text', text: "Contacting system kernel matrix sensors...", color: 'var(--text-secondary)' }]);
    
    setTimeout(() => {
      setIsInstalling(false);
      setLogs(prev => [...prev, { type: 'text', text: "[OK] Connection established. Telemetry stream launched.", color: '#27C93F' }]);
      
      const renderStats = () => {
        const activeTheme = localStorage.getItem('om-dev-theme') || 'cream';
        const latency = (Math.random() * 0.05 + 0.02).toFixed(3);
        const memory = (Math.random() * 1.8 + 24.2).toFixed(1);
        const fps = (Math.random() * 0.4 + 59.6).toFixed(1);
        const bandwidth = (Math.random() * 0.03 + 0.01).toFixed(3);

        const memPct = Math.round((parseFloat(memory) / 128) * 100);
        const memBarFilled = Math.round((memPct / 100) * 15);
        const memBar = "#".repeat(memBarFilled) + ".".repeat(15 - memBarFilled);

        const fpsPct = Math.round((parseFloat(fps) / 60) * 100);
        const fpsBarFilled = Math.round((fpsPct / 100) * 15);
        const fpsBar = "#".repeat(fpsBarFilled) + ".".repeat(15 - fpsBarFilled);

        setTelemetry({
          theme: activeTheme,
          latency,
          memory,
          memPct,
          memBar,
          fps,
          fpsBar,
          bandwidth
        });
      };

      renderStats();
      telemetryIntervalRef.current = setInterval(renderStats, 1000);
    }, 600);
  };

  // ── OpenRouter streaming terminal AI session twin ──
  const startAiSession = () => {
    setIsInstalling(true);
    setLogs(prev => [
      ...prev,
      { type: 'text', text: "Calibrating secure terminal bridge...", color: 'var(--text-secondary)' },
      { type: 'text', text: "Starting Om·AI Assistant agent loop...", color: 'var(--text-secondary)' }
    ]);

    setTimeout(() => {
      setIsInstalling(false);
      setLogs(prev => [
        ...prev,
        {
          type: 'html',
          html: `
<div style="border-top: 1px solid var(--border-subtle); border-bottom: 1px solid var(--border-subtle); padding: 8px 0; margin: 8px 0;">
  <span style="color: #27C93F; font-weight: bold;">==================================================</span>
  <br><span style="color: var(--term-accent); font-weight: bold;">[Om·AI INTERACTIVE ASSISTANT SESSION ESTABLISHED]</span>
  <br>Ask me anything about Om, his projects, or skills!
  <br>Type <span style="color: #FFBD2E; font-weight: bold;">exit</span> to terminate the session.
  <br><span style="color: #27C93F; font-weight: bold;">==================================================</span>
</div>`
        }
      ]);

      setIsAiSession(true);
      setAiHistory([]);
      setPromptPrefix("om-ai@terminal:~$");
      setPlaceholder("Ask Om·AI anything...");
    }, 600);
  };

  const handleAiSessionInput = async (cmdText) => {
    const cmd = cmdText.trim();
    if (cmd.toLowerCase() === "exit" || cmd.toLowerCase() === "quit") {
      setLogs(prev => [...prev, { type: 'text', text: "[Om·AI SESSION CLOSED] Returning to normal console.", color: '#FFBD2E' }]);
      setIsAiSession(false);
      setPromptPrefix("visitor@om.dev:~$");
      setPlaceholder("Type a command...");
      return;
    }

    setIsInstalling(true);
    setPlaceholder("Om·AI is thinking...");

    const updatedHistory = [...aiHistory, { role: 'user', content: cmd }];
    setAiHistory(updatedHistory);

    const logIndex = logs.length;
    // Add prompt trace and placeholder bubble in logs
    setLogs(prev => [
      ...prev,
      { type: 'text', text: ` visitor@om.dev:~$ ${cmd}`, color: 'var(--term-text)' },
      { type: 'html', html: `<span style="color: var(--term-accent); font-weight: bold;">om-ai@terminal:~$</span> <span id="stream-${logIndex}">Thinking...</span>` }
    ]);

    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || '';

    try {
      const resp = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://dev-om.edgeone.app',
          'X-Title': 'Om Portfolio'
        },
        body: JSON.stringify({
          model: 'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
          messages: [
            {
              role: 'system',
              content: `You are "Om·AI" — the personal AI twin of Om Rajput, embedded in his terminal console. You represent Om and know everything about him deeply. You ONLY talk about Om, his work, projects, and skills.
Your answers should be optimized for a terminal view. Use plain text or light HTML color formatting.

== ABOUT OM RAJPUT ==
Om Rajput is a creative developer building AI-first web products with a strong focus on beautiful UI/UX and modern architecture.
Email: ommanav.mail@gmail.com
Available for: Freelance · Contract · Collaboration
Specialties: Frontend Engineering, AI Integration, Product Design, Full-Stack Development

== PROJECTS (8 total) ==
1. Strophe AI — NEW, LIVE (2026). All-in-one AI companion: coding mode, study mode, general chat. Uses GPT-4o & Claude. Features: Pomodoro timer, auto flashcards, live code preview. Affordable pricing. URL: https://strophe.abacusai.app
2. Clarimap — Upcoming (2026). AI visualization engine that turns code, system architectures, and study concepts into interactive diagrams in real-time. URL: https://clarimap.edgeone.app
3. Rivelo AI — LIVE (2026). High-performance AI workspace with 4 personas: General, Speed, Full-Stack Coding, Complex Reasoning. Bring-your-own-model via OpenRouter. Vision & voice input. Privacy-first. URL: https://riveloai.edgeone.app
4. Custom LLM Family — Upcoming (2025–2026). Three custom-trained models: Strophe 1 (edge-optimized), Antistrophe, and Strophe Aion (frontier-grade reasoning). Bespoke tokenizer + reasoning-first architecture. URL: https://strophe.edgeone.app
5. Sunday Cups — UI Design (2026). Premium editorial coffee site. Intentional white space + beautiful typography. URL: https://sundaycups.netlify.app
6. Codecamy — UI Design (2026). Bold, visual coding-education platform UI/UX. URL: https://codecamy.edgeone.app
7. Prompchitect — AI Tool (2026). Advanced AI orchestration dashboard: 350+ LLMs via OpenRouter, dark-themed, built for prompt architects and power users. URL: https://prompchitect.edgeone.app
8. Muaazfoods — UI Design (2026). Premium "Volume I" editorial digital menu for a restaurant. Minimalist culinary branding. URL: https://muaazfoodz.edgeone.app

== STRICT RULES ==
- NEVER output raw links. ALWAYS use the project card format: [PROJECT_CARD: Exact Project Name]
- Example of how to respond:
  Strophe AI is an amazing AI companion. Here it is:
  [PROJECT_CARD: Strophe AI]
- If a user asks for all projects, list them one by one, explaining each briefly and including the [PROJECT_CARD: Name] after each explanation.
- Keep your replies concise, witty, and developer-friendly. Use emojis naturally.`
            },
            ...updatedHistory
          ],
          stream: true,
          temperature: 0.7,
          max_tokens: 1500
        })
      });

      if (!resp.ok) throw new Error("API Connection failed");

      const reader = resp.body.getReader();
      const dec = new TextDecoder();
      let buf = '', content = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const lines = buf.split('\n');
        buf = lines.pop();

        for (const line of lines) {
          const t = line.trim();
          if (!t.startsWith('data:')) continue;
          const raw = t.slice(5).trim();
          if (raw === '[DONE]') continue;
          try {
            const chunk = JSON.parse(raw);
            const delta = chunk.choices?.[0]?.delta;
            if (delta && delta.content) {
              content += delta.content;
              const streamSpan = document.getElementById(`stream-${logIndex}`);
              if (streamSpan) {
                streamSpan.innerHTML = mdToTerminal(content) + '<span class="cursor" style="display: inline-block; width: 2px; height: 12px; background: var(--term-accent); animation: assistant-blink .65s infinite; vertical-align: middle; margin-left: 2px;"></span>';
              }
              if (termBodyRef.current) {
                termBodyRef.current.scrollTop = termBodyRef.current.scrollHeight;
              }
            }
          } catch (e) {}
        }
      }

      const streamSpan = document.getElementById(`stream-${logIndex}`);
      if (streamSpan) streamSpan.innerHTML = mdToTerminal(content);
      
      setAiHistory(prev => [...prev, { role: 'assistant', content }]);
      setLogs(prev => {
        const nextLogs = [...prev];
        nextLogs[nextLogs.length - 1] = {
          type: 'html',
          html: `<span style="color: var(--term-accent); font-weight: bold;">om-ai@terminal:~$</span> <span>${mdToTerminal(content)}</span>`
        };
        return nextLogs;
      });
      
    } catch (err) {
      const streamSpan = document.getElementById(`stream-${logIndex}`);
      if (streamSpan) {
        streamSpan.innerHTML = `<span style="color: #FF5F56;">Error: ${err.message || "Failed to stream assistant."}</span>`;
      }
    }

    setIsInstalling(false);
    setPlaceholder("Ask Om·AI anything...");
  };

  const mdToTerminal = (raw) => {
    if (!raw) return '';
    let s = raw
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    s = s.replace(/\[PROJECT_CARD:\s*([^\]]+)\]/gi, (match, name) => {
      const key = Object.keys(projectCardsDB).find(k => k.toLowerCase() === name.trim().toLowerCase());
      if (!key) return `[Project: ${name}]`;
      const p = projectCardsDB[key];
      const isVideo = p.img.endsWith('.mp4');
      
      const mediaHtml = isVideo
        ? `<video src="${p.img}" autoplay loop muted playsinline style="width: 100%; height: 120px; object-fit: cover; border-radius: 4px; border: 1.5px solid var(--term-border); margin-bottom: 8px; display: block;"></video>`
        : `<div style="width: 100%; height: 120px; background-image: url('${p.img}'); background-size: cover; background-position: center; border-radius: 4px; border: 1.5px solid var(--term-border); margin-bottom: 8px;"></div>`;

      return `
<div style="border: 1.5px solid var(--term-border); background: rgba(0,0,0,0.05); padding: 12px; margin: 10px 0; border-radius: 6px; max-width: 440px; text-align: left; box-shadow: 3px 3px 0px var(--term-border);">
  ${mediaHtml}
  <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1.5px dashed var(--term-border); padding-bottom: 6px; margin-bottom: 8px; font-weight: 700;">
    <span style="color: var(--term-accent); font-size: 1.05em;">${key}</span>
    <span style="border: 1px solid var(--term-border); padding: 2px 8px; font-size: 0.75em; border-radius: 4px; text-transform: uppercase; background: rgba(0,0,0,0.02); color: var(--term-text); font-weight: bold;">${p.status}</span>
  </div>
  <div style="font-size: 0.9em; line-height: 1.5; color: var(--term-text); margin-bottom: 10px;">${p.desc}</div>
  <div style="font-size: 0.85em;">
    <span style="opacity: 0.6; font-weight: bold;">[ACCESS_LINK] :</span> <a href="${p.url}" target="_blank" rel="noopener" style="color: var(--term-accent); text-decoration: underline; font-weight: 700;">Visit ${key}</a>
  </div>
</div>`;
    });

    s = s.replace(/^## (.+)$/gm, '<div style="font-weight: bold; color: var(--term-accent); margin-top: 8px;">$1</div>');
    s = s.replace(/^### (.+)$/gm, '<div style="font-weight: bold; margin-top: 6px;">$1</div>');
    s = s.replace(/\*\*(.+?)\*\*/g, '<strong style="color: var(--term-accent); font-weight: bold;">$1</strong>');
    s = s.replace(/\*(.+?)\*/g, '<em style="font-style: italic;">$1</em>');
    s = s.replace(/`([^`]+)`/g, '<code style="background: rgba(0,0,0,0.2); padding: 2px 4px; border-radius: 4px; font-family: monospace; color: #ff8c00;">$1</code>');
    s = s.replace(/^- (.+)$/gm, '<div style="padding-left: 10px; margin: 2px 0;">• $1</div>');
    s = s.replace(/\n/g, '<br>');

    return s;
  };

  // ── post-install installation of developer skills ──
  const runSkillsInstaller = async () => {
    setIsInstalling(true);
    setPlaceholder("Preparing installer...");

    const installerSteps = [
      { text: "Parsing package.json dependencies...", done: "package.json resolved." },
      { text: "Resolving peer dependencies and dependency tree...", done: "Found 24 packages to install." },
      { text: "Fetching packages from npm registry (registry.npmjs.org)...", done: "Tarballs successfully downloaded." }
    ];

    for (const step of installerSteps) {
      await new Promise((resolve) => {
        setLogs(prev => [...prev, { type: 'loader', activeText: step.text, doneText: '' }]);
        setTimeout(() => {
          setLogs(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = { type: 'success', text: step.done };
            return updated;
          });
          resolve();
        }, 500);
      });
    }

    setLogs(prev => [...prev, { type: 'text', text: "npm install om-skills --save-dev", color: 'var(--term-accent)' }]);

    // Simulated progress bar installation
    await new Promise((resolve) => {
      let progress = 0;
      setLogs(prev => [...prev, { type: 'progressBar', text: "npm install om-skills", progress: 0 }]);
      
      const interval = setInterval(() => {
        progress += 10;
        setLogs(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { type: 'progressBar', text: "npm install om-skills", progress };
          return updated;
        });

        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setLogs(prev => {
              const updated = [...prev];
              updated[updated.length - 1] = { type: 'success', text: "npm install om-skills -> Added 24 packages in 1.2s." };
              return updated;
            });
            resolve();
          }, 100);
        }
      }, 100);
    });

    // Post installation configurations
    setLogs(prev => [...prev, { type: 'loader', activeText: "Running post-install configuration scripts...", doneText: '' }]);
    await new Promise(r => setTimeout(r, 450));
    setLogs(prev => {
      const updated = [...prev];
      updated[updated.length - 1] = { type: 'success', text: "Environment configured." };
      return updated;
    });

    setLogs(prev => [...prev, { type: 'loader', activeText: "Initializing skills database indexes...", doneText: '' }]);
    await new Promise(r => setTimeout(r, 300));
    setLogs(prev => {
      const updated = [...prev];
      updated[updated.length - 1] = { type: 'success', text: "Indexes mapped." };
      return updated;
    });

    setLogs(prev => [
      ...prev,
      {
        type: 'html',
        html: `
<div class="terminal-skills-container" style="margin-top: 10px;">
  <div class="terminal-log-row" style="color: #27C93F; font-weight: bold; margin-bottom: 4px;">Skills Index successfully initialized:</div>
  <div>
    <span class="terminal-skills-category" style="color: var(--term-accent); font-weight: bold;">Frontend Core:</span>
    <div class="terminal-skills-list" style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px;">
      <span class="terminal-skill-chip" style="font-size: 0.75rem; padding: 4px 10px; background: rgba(11, 12, 14, 0.04); border: 1px solid rgba(11, 12, 14, 0.08); border-radius: 6px;">HTML5</span>
      <span class="terminal-skill-chip" style="font-size: 0.75rem; padding: 4px 10px; background: rgba(11, 12, 14, 0.04); border: 1px solid rgba(11, 12, 14, 0.08); border-radius: 6px;">CSS3/Tailwind</span>
      <span class="terminal-skill-chip" style="font-size: 0.75rem; padding: 4px 10px; background: rgba(11, 12, 14, 0.04); border: 1px solid rgba(11, 12, 14, 0.08); border-radius: 6px;">JS/ES6+</span>
      <span class="terminal-skill-chip" style="font-size: 0.75rem; padding: 4px 10px; background: rgba(11, 12, 14, 0.04); border: 1px solid rgba(11, 12, 14, 0.08); border-radius: 6px;">DOM Physics</span>
    </div>
  </div>
  <div style="margin-top: 6px;">
    <span class="terminal-skills-category" style="color: var(--term-accent); font-weight: bold;">Frameworks & Libs:</span>
    <div class="terminal-skills-list" style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px;">
      <span class="terminal-skill-chip" style="font-size: 0.75rem; padding: 4px 10px; background: rgba(11, 12, 14, 0.04); border: 1px solid rgba(11, 12, 14, 0.08); border-radius: 6px;">Next.js</span>
      <span class="terminal-skill-chip" style="font-size: 0.75rem; padding: 4px 10px; background: rgba(11, 12, 14, 0.04); border: 1px solid rgba(11, 12, 14, 0.08); border-radius: 6px;">React</span>
      <span class="terminal-skill-chip" style="font-size: 0.75rem; padding: 4px 10px; background: rgba(11, 12, 14, 0.04); border: 1px solid rgba(11, 12, 14, 0.08); border-radius: 6px;">WebGL Math</span>
      <span class="terminal-skill-chip" style="font-size: 0.75rem; padding: 4px 10px; background: rgba(11, 12, 14, 0.04); border: 1px solid rgba(11, 12, 14, 0.08); border-radius: 6px;">LERP Animation</span>
    </div>
  </div>
  <div style="margin-top: 6px;">
    <span class="terminal-skills-category" style="color: var(--term-accent); font-weight: bold;">AI Systems:</span>
    <div class="terminal-skills-list" style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px;">
      <span class="terminal-skill-chip" style="font-size: 0.75rem; padding: 4px 10px; background: rgba(11, 12, 14, 0.04); border: 1px solid rgba(11, 12, 14, 0.08); border-radius: 6px;">OpenRouter APIs</span>
      <span class="terminal-skill-chip" style="font-size: 0.75rem; padding: 4px 10px; background: rgba(11, 12, 14, 0.04); border: 1px solid rgba(11, 12, 14, 0.08); border-radius: 6px;">GPT-4o/Claude</span>
      <span class="terminal-skill-chip" style="font-size: 0.75rem; padding: 4px 10px; background: rgba(11, 12, 14, 0.04); border: 1px solid rgba(11, 12, 14, 0.08); border-radius: 6px;">LLM Tuning</span>
      <span class="terminal-skill-chip" style="font-size: 0.75rem; padding: 4px 10px; background: rgba(11, 12, 14, 0.04); border: 1px solid rgba(11, 12, 14, 0.08); border-radius: 6px;">Bespoke Prompting</span>
    </div>
  </div>
</div>`
      }
    ]);

    setIsInstalling(false);
    setPlaceholder("Type a command...");
  };

  // High-fidelity inline terminal OTA installation simulator
  const runTerminalOtaUpdate = async () => {
    setIsInstalling(true);
    setPlaceholder("Upgrading system...");

    if (telemetryIntervalRef.current) {
      clearInterval(telemetryIntervalRef.current);
      telemetryIntervalRef.current = null;
    }
    setTelemetry(null);
    setLogs([]);

    const log = (text, type = 'text', color = 'var(--text-primary)') => {
      setLogs(prev => [...prev, { type, text, color }]);
    };

    const animateStep = async (activeText, doneText, duration = 800) => {
      setLogs(prev => [...prev, { type: 'loader', activeText }]);
      await new Promise(r => setTimeout(r, duration));
      setLogs(prev => {
        const updated = [...prev];
        const lastLoaderIdx = updated.findLastIndex(item => item.type === 'loader');
        if (lastLoaderIdx !== -1) {
          updated[lastLoaderIdx] = { type: 'success', text: doneText };
        }
        return updated;
      });
    };

    log(`⚡ <span style="color: var(--term-accent); font-weight: bold;">[SYSTEM] INITIATING STROPHESHELL CORE OTA BUILD UPDATE...</span>`, 'html');
    await new Promise(r => setTimeout(r, 400));

    await animateStep("Connecting to server update repository origin/main...", "Server response: 200. Verification handshake concluded.", 800);
    log(`[OK] Retrieved build descriptor: build_v1.3.1_stable (Size: 216.4 KB)`, 'text', '#22c55e');
    await new Promise(r => setTimeout(r, 400));

    // Progress bar
    setLogs(prev => [...prev, { type: 'progressBar', text: 'Downloading:', progress: 0 }]);

    let progressVal = 0;
    const totalSize = 216.4;

    await new Promise((resolve) => {
      const downloadInterval = setInterval(() => {
        progressVal += Math.random() * 12 + 4;
        if (progressVal >= 100) {
          progressVal = 100;
          clearInterval(downloadInterval);
          resolve();
        }

        const downloaded = ((progressVal / 100) * totalSize).toFixed(1);
        const rate = (Math.random() * 80 + 120).toFixed(0);

        setLogs(prev => {
          const updated = [...prev];
          const idx = updated.findLastIndex(item => item.type === 'progressBar');
          if (idx !== -1) {
            const barLength = 20;
            const filled = Math.round((progressVal / 100) * barLength);
            const empty = Math.max(0, barLength - filled - 1);
            const bar = "=".repeat(filled) + (filled < barLength ? ">" : "") + " ".repeat(empty);
            updated[idx] = {
              type: 'text',
              text: `Downloading: [${bar}] ${progressVal.toFixed(0)}%  (${downloaded} KB / ${totalSize} KB)  ${rate} KB/s`,
              color: 'var(--term-text)'
            };
          } else {
            const barLength = 20;
            const filled = Math.round((progressVal / 100) * barLength);
            const empty = Math.max(0, barLength - filled - 1);
            const bar = "=".repeat(filled) + (filled < barLength ? ">" : "") + " ".repeat(empty);
            updated.push({
              type: 'text',
              text: `Downloading: [${bar}] ${progressVal.toFixed(0)}%  (${downloaded} KB / ${totalSize} KB)  ${rate} KB/s`,
              color: 'var(--term-text)'
            });
          }
          return updated;
        });
      }, 120);
    });

    log(`[ OK ] Chunks successfully downloaded: ${totalSize} KB / ${totalSize} KB.`, 'text', '#22c55e');
    await new Promise(r => setTimeout(r, 400));

    await animateStep("Verifying package cryptographic signatures...", "SHA-256 signature verified: f8c7e9a0... MATCH", 800);
    await animateStep("Purging client cache manifests and index blocks...", "Client memory buffers flushed and static cache cleared.", 700);
    await animateStep("Extracting compilation package dependencies...", "Dynamic layout transforms and perspective anchors updated.", 800);
    await animateStep("Rebuilding system boot manifest configurations...", "System flash complete! Rebooting kernel...", 1000);

    let count = 3;
    setLogs(prev => [...prev, { type: 'text', text: `Rebooting in ${count}...`, color: 'var(--term-accent)', fontWeight: 'bold' }]);

    await new Promise((resolve) => {
      const countdownInterval = setInterval(() => {
        count--;
        if (count < 0) {
          clearInterval(countdownInterval);
          resolve();
        } else {
          setLogs(prev => {
            const updated = [...prev];
            const idx = updated.findLastIndex(item => item.text && item.text.startsWith('Rebooting in'));
            if (idx !== -1) {
              updated[idx] = { type: 'text', text: `Rebooting in ${count}...`, color: 'var(--term-accent)', fontWeight: 'bold' };
            }
            return updated;
          });
        }
      }, 800);
    });

    window.location.reload();
  };

  // Watch for autoRunCommand when console becomes active
  useEffect(() => {
    if (active && autoRunCommand) {
      if (skipBoot) {
        setIsInstalling(false);
        setPlaceholder("Type a command...");
        setLogs([]);
        executeCommand(autoRunCommand);
        onAutoRunComplete();
      }
    }
  }, [active, autoRunCommand, skipBoot]);

  // ── core commands executor router ──
  const executeCommand = async (rawCmd) => {
    const cleanCmd = rawCmd.toLowerCase().trim();
    let sanitized = cleanCmd.replace(/\s+/g, "");

    // Clear telemetry on command spawn
    if (telemetryIntervalRef.current) {
      clearInterval(telemetryIntervalRef.current);
      telemetryIntervalRef.current = null;
    }
    setTelemetry(null);

    // Command alias resolution
    if (sanitized === "stropheai") sanitized = "strophe";
    if (["customllm", "customllmfamily", "strophellm"].includes(sanitized)) sanitized = "llm";
    if (sanitized === "sundaycup") sanitized = "sundaycups";
    if (["askai", "toggleai", "ask-ai", "aiassistant", "ai"].includes(sanitized)) sanitized = "ai";

    // Write trace to screen
    setLogs(prev => [...prev, { type: 'prompt', cmd: rawCmd }]);

    if (isInstalling) return;

    // Theme command router
    if (cleanCmd.startsWith("theme")) {
      const args = cleanCmd.split(/\s+/).slice(1);
      const sub = args[0] || "list";
      
      if (sub === "list" || sub === "help") {
        setLogs(prev => [...prev, {
          type: 'html',
          html: `
<span style="color: var(--text-primary); font-weight: bold;">System Theme Kernel Catalog:</span>
<br>  <span style="color: var(--term-accent); font-weight: bold;">theme cream</span>  - Shifting to Warm Cream Neo-Brutalist (Default)
<br>  <span style="color: #27C93F; font-weight: bold;">theme kernel</span> - Shifting to Retro Matrix Cyber-Console
<br>  <span style="color: #a855f7; font-weight: bold;">theme swiss</span>  - Shifting to High-Contrast Stark Swiss Brutalist
<br>  <span style="color: #d946ef; font-weight: bold;">theme cyber</span>  - Shifting to Tokyo Cyberpunk Edition
<br>  <span style="color: #86efac; font-weight: bold;">theme spruce</span> - Shifting to Forest Spruce / Nordic Sage`
        }]);
      } else if (["cream", "kernel", "swiss", "cyber", "spruce"].includes(sub)) {
        setIsInstalling(true);
        setLogs(prev => [...prev, { type: 'loader', activeText: "Connecting to visual theme compiler...", doneText: "Theme server connection established." }]);
        await new Promise(r => setTimeout(r, 450));
        setLogs(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { type: 'success', text: "Theme server connection established." };
          return updated;
        });

        setLogs(prev => [...prev, { type: 'loader', activeText: `Fetching color palette variables for '${sub}'...`, doneText: "Color palette variables parsed." }]);
        await new Promise(r => setTimeout(r, 500));
        setLogs(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { type: 'success', text: "Color palette variables parsed." };
          return updated;
        });

        setLogs(prev => [...prev, { type: 'loader', activeText: "Re-compiling root CSS variables...", doneText: "CSS compiled successfully." }]);
        await new Promise(r => setTimeout(r, 350));
        setLogs(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { type: 'success', text: "CSS compiled successfully." };
          return updated;
        });

        onThemeChange(sub);
        setLogs(prev => [...prev, { type: 'success', text: `✔ Theme shift concluded. Shifting system variables to theme '${sub.toUpperCase()}'.` }]);
        setIsInstalling(false);
      } else {
        setLogs(prev => [...prev, { type: 'error', text: `Theme error: recognized options are cream, kernel, swiss, cyber, or spruce.` }]);
      }
      return;
    }

    // Update command router
    if (cleanCmd.startsWith("update")) {
      const args = cleanCmd.split(/\s+/).slice(1);
      const sub = args[0] || "check";
      
      if (sub === "check") {
        setIsInstalling(true);
        setLogs(prev => [...prev, { type: 'text', text: "Querying server version.json signature...", color: 'var(--text-primary)' }]);
        setTimeout(() => {
          setIsInstalling(false);
          onOtaTrigger();
        }, 800);
      } else if (["test", "force", "run"].includes(sub)) {
        runTerminalOtaUpdate();
      } else {
        setLogs(prev => [...prev, { type: 'error', text: "Update error: recognized options are update check or update run." }]);
      }
      return;
    }

    // Project Diagnostic command matchers
    if (projectDB[sanitized]) {
      const p = projectDB[sanitized];
      setIsInstalling(true);
      
      setLogs(prev => [...prev, { type: 'loader', activeText: `Connecting to deployment servers for '${p.title}'...`, doneText: "Connected to remote host." }]);
      await new Promise(r => setTimeout(r, 450));
      setLogs(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { type: 'success', text: "Connected to remote host." };
        return updated;
      });

      setLogs(prev => [...prev, { type: 'loader', activeText: "Querying diagnostics status reports...", doneText: "Diagnostics index resolved." }]);
      await new Promise(r => setTimeout(r, 500));
      setLogs(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { type: 'success', text: "Diagnostics index resolved." };
        return updated;
      });

      setLogs(prev => [
        ...prev,
        {
          type: 'html',
          html: `
<div style="font-family: monospace; line-height: 1.6;">
  ==================================================
  <br><strong style="color: var(--term-text);">[PROJECT DIAGNOSTICS] - ${p.title.toUpperCase()}</strong>
  <br>==================================================
  <br>Status       : <span style="color: ${p.status === "LIVE" ? "#27C93F" : "#FFBD2E"}; font-weight: bold;">${p.status}</span>
  <br>Launch Year  : ${p.year}
  <br>Tech Core    : ${p.tech}
  <br>Core Tags    : ${p.tags}
  <br>Description  : ${p.desc}
  <br>Target Link  : <a href="${p.url}" target="_blank" rel="noopener" style="text-decoration: underline; color: var(--term-accent); font-weight: bold;">[Click to Visit]</a>
  <br>==================================================
</div>`
        }
      ]);
      setIsInstalling(false);
      return;
    }

    switch (sanitized) {
      case "help":
        setLogs(prev => [...prev, {
          type: 'html',
          html: `
<span style="color: var(--term-text); font-weight: bold;">Command Catalog:</span>
<br>  <span style="color: var(--term-accent); font-weight: bold;">help</span>     - Display all available options
<br>  <span style="color: var(--term-accent); font-weight: bold;">bio</span>      - Print professional editorial bio profile
<br>  <span style="color: var(--term-accent); font-weight: bold;">projects</span> - Lists current active developer builds (staggered)
<br>  <span style="color: var(--term-accent); font-weight: bold;">links</span>    - Output clickable targets for all builds (staggered)
<br>  <span style="color: var(--term-accent); font-weight: bold;">skills</span>   - Run interactive terminal skills index installer
<br>  <span style="color: var(--term-accent); font-weight: bold;">system</span>   - Launch real-time visual system performance diagnostics
<br>  <span style="color: var(--term-accent); font-weight: bold;">game</span>     - Initiate locksbreaker passcode decryption minigame
<br>  <span style="color: var(--term-accent); font-weight: bold;">matrix</span>   - Load full-screen retro green code matrix screensaver
<br>  <span style="color: var(--term-accent); font-weight: bold;">ai</span>       - Close Dev Mode & automatically open Om·AI Assistant
<br>  <span style="color: var(--term-accent); font-weight: bold;">update</span>   - Trigger system check/test ('update check' / 'update run')
<br>  <span style="color: var(--term-accent); font-weight: bold;">[name]</span>   - Enter project name (e.g. <span style="color: var(--term-accent);">strophe</span>, <span style="color: var(--term-accent);">rivelo</span>) for diagnostics
<br>  <span style="color: var(--term-accent); font-weight: bold;">clear</span>    - Flushes console logs buffer
<br>  <span style="color: var(--term-accent); font-weight: bold;">exit</span>     - Return to GUI portfolio navigation`
        }]);
        break;

      case "bio":
        setIsInstalling(true);
        setLogs(prev => [...prev, { type: 'loader', activeText: "Connecting to secure database db.om.dev:5432...", doneText: "Connected to db.om.dev." }]);
        await new Promise(r => setTimeout(r, 450));
        setLogs(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { type: 'success', text: "Connected to db.om.dev." };
          return updated;
        });

        setLogs(prev => [...prev, { type: 'loader', activeText: "Executing query: SELECT * FROM profiles WHERE name='Om Rajput'...", doneText: "Query completed." }]);
        await new Promise(r => setTimeout(r, 550));
        setLogs(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { type: 'success', text: "Query completed." };
          return updated;
        });

        setLogs(prev => [
          ...prev,
          {
            type: 'html',
            html: `
<div class="notion-style-callout" style="border-left: 2.5px solid var(--term-border); padding-left: 1rem; margin: 0.5rem 0;">
  <p style="font-weight: 700; margin-bottom: 0.25rem; color: var(--term-text);">Om Rajput // Systems Engineer & UI Specialist</p>
  <p style="color: var(--term-text); opacity: 0.85; margin: 0;">Creative developer crafting next-generation AI-first web applications.</p>
  <p style="color: var(--term-text); opacity: 0.85; margin: 0;">Brings extreme effort to fluid micro-interactions, responsive clean token architecture scales, and bespoke multi-model API frameworks.</p>
  <p style="color: var(--term-text); opacity: 0.85; margin-top: 0.25rem; margin-bottom: 0;">Available for freelance contracts and engineering collaborations.</p>
</div>`
          }
        ]);
        setIsInstalling(false);
        break;

      case "projects":
        setIsInstalling(true);
        setLogs(prev => [...prev, { type: 'loader', activeText: "Checking workspace registry configuration...", doneText: "Workspace registry parsed." }]);
        await new Promise(r => setTimeout(r, 450));
        setLogs(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { type: 'success', text: "Workspace registry parsed (found 8 builds)." };
          return updated;
        });

        setLogs(prev => [...prev, { type: 'loader', activeText: "Querying git branches states...", doneText: "Git branches synced." }]);
        await new Promise(r => setTimeout(r, 500));
        setLogs(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { type: 'success', text: "States synced. All builds are online." };
          return updated;
        });

        const rows = [];
        rows.push(`+----------------------+------------+--------------------+`);
        rows.push(`| <span style="font-weight:bold;">PROJECT TITLE</span>        | <span style="font-weight:bold;">STATUS</span>     | <span style="font-weight:bold;">TECH CORE</span>          |`);
        rows.push(`+----------------------+------------+--------------------+`);
        Object.keys(projectDB).forEach(key => {
          const p = projectDB[key];
          const color = p.status === "LIVE" ? "#27C93F" : "#FFBD2E";
          const statusText = `<span style="color: ${color}; font-weight: bold;">${p.status}</span>`;
          const pad = p.status === "LIVE" ? "   " : "   ";
          rows.push(`| ${p.title.padEnd(20)} | ${statusText}${pad} | ${p.tech.padEnd(18)} |`);
        });
        rows.push(`+----------------------+------------+--------------------+`);

        setLogs(prev => [...prev, {
          type: 'html',
          html: `<div style="font-family: monospace; line-height: 1.5;">${rows.join('<br>')}</div>`
        }]);
        setIsInstalling(false);
        break;

      case "links":
        setIsInstalling(true);
        setLogs(prev => [...prev, { type: 'loader', activeText: "Scanning DNS maps...", doneText: "DNS maps loaded." }]);
        await new Promise(r => setTimeout(r, 400));
        setLogs(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { type: 'success', text: "DNS pointers resolved." };
          return updated;
        });

        const linksHtml = [];
        Object.keys(projectDB).forEach((key, idx) => {
          const p = projectDB[key];
          linksHtml.push(`<span style="color:var(--term-accent); font-weight: 700;">[${idx + 1}]</span> ${p.title.padEnd(20)} &rarr; <a href="${p.url}" target="_blank" rel="noopener" style="text-decoration: underline; color: var(--term-accent); font-weight: bold;">[Visit Link]</a>`);
        });

        setLogs(prev => [...prev, {
          type: 'html',
          html: `<div style="font-family: monospace; line-height: 1.55;">${linksHtml.join('<br>')}</div>`
        }]);
        setIsInstalling(false);
        break;

      case "skills":
        runSkillsInstaller();
        break;

      case "game":
      case "hack":
        startHackingGame();
        break;

      case "matrix":
        startMatrixScreensaver();
        break;

      case "system":
      case "dashboard":
        startTelemetryStream();
        break;

      case "ai":
        startAiSession();
        break;

      case "clear":
        setLogs([]);
        break;

      case "exit":
        onClose();
        break;

      default:
        setIsInstalling(true);
        setPlaceholder("Searching bin...");
        setTimeout(() => {
          setLogs(prev => [...prev, { type: 'error', text: `om-sh: command not found: ${rawCmd}. Type help for catalog.` }]);
          setIsInstalling(false);
          setPlaceholder("Type a command...");
        }, 400);
    }
  };

  const handleInputChange = (e) => {
    setInputVal(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const commandText = inputVal.trim();
      if (!commandText) return;

      setInputVal("");
      
      if (isGameActive) {
        handleGameInput(commandText);
        return;
      }

      if (isAiSession) {
        handleAiSessionInput(commandText);
        return;
      }

      setHistory(prev => {
        const updated = [...prev, commandText];
        if (updated.length > 50) updated.shift();
        return updated;
      });
      setHistoryIndex(prev => history.length + 1);

      executeCommand(commandText);
    } else if (e.key === "ArrowUp") {
      if (history.length > 0) {
        e.preventDefault();
        const nextIndex = Math.max(0, historyIndex - 1);
        setHistoryIndex(nextIndex);
        setInputVal(history[nextIndex]);
      }
    } else if (e.key === "ArrowDown") {
      if (history.length > 0) {
        e.preventDefault();
        const nextIndex = Math.min(history.length, historyIndex + 1);
        setHistoryIndex(nextIndex);
        if (nextIndex === history.length) {
          setInputVal("");
        } else {
          setInputVal(history[nextIndex]);
        }
      }
    }
  };

  const handleFocus = () => {
    if (telemetryIntervalRef.current) {
      clearInterval(telemetryIntervalRef.current);
      telemetryIntervalRef.current = null;
      setTelemetry(null);
      setLogs(prev => [...prev, { type: 'text', text: "[TELEMETRY STREAM TERMINATED] Normal console prompt restored.", color: '#FF5F56' }]);
    }
  };

  return (
    <div 
      id="dev-console-drawer" 
      className={`dev-console-drawer ${active ? 'active' : ''}`} 
      aria-label="Developer Console Terminal Shell"
      aria-hidden={!active}
    >
      {/* Terminal Header */}
      <div className="terminal-header">
        <button 
          onClick={onClose}
          id="dev-console-close" 
          className="mobile-close-btn" 
          aria-label="Close Developer Console"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <span className="window-title-meta">om.dev_kernel_v1.3.0</span>
        <div className="header-spacer-right"></div>
      </div>

      {/* Terminal Logs (Body scroll area) */}
      <div 
        ref={termBodyRef}
        id="terminal-body" 
        className="terminal-body"
        onClick={() => { if (!isInstalling && inputRef.current) inputRef.current.focus(); }}
      >
        {logs.map((log, idx) => {
          if (log.type === 'prompt') {
            return (
              <div key={idx} className="terminal-log-row">
                <span style={{ color: 'var(--term-accent)', fontWeight: 'bold' }}>visitor@om.dev:~$</span> {log.cmd}
              </div>
            );
          }
          if (log.type === 'recovery_loader') {
            return (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '15px', height: '100%', color: 'var(--term-accent)', minHeight: '250px' }}>
                <div className="ota-spinner" style={{ width: '36px', height: '36px' }}></div>
                <div style={{ fontFamily: 'monospace', fontSize: '0.8rem', letterSpacing: '0.15em', opacity: 0.8, fontWeight: 'bold' }}>RETRIEVING STROPHESHELL SESSION...</div>
              </div>
            );
          }
          if (log.type === 'loader') {
            return (
              <div key={idx} className="terminal-log-row">
                <span style={{ color: 'var(--term-accent)', fontWeight: 'bold', fontFamily: 'monospace' }}>⠋</span> <span style={{ color: 'var(--text-secondary)' }}>{log.activeText}</span>
              </div>
            );
          }
          if (log.type === 'success') {
            return (
              <div key={idx} className="terminal-log-row">
                <span style={{ color: '#27C93F', fontWeight: 'bold' }}>✔</span> <span style={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{log.text}</span>
              </div>
            );
          }
          if (log.type === 'error') {
            return (
              <div key={idx} className="terminal-log-row" style={{ color: '#FF5F56' }}>
                {log.text}
              </div>
            );
          }
          if (log.type === 'progressBar') {
            const barLength = 20;
            const filled = Math.round((log.progress / 100) * barLength);
            const empty = barLength - filled;
            const bar = "#".repeat(filled) + ".".repeat(empty);
            return (
              <div key={idx} className="terminal-log-row">
                <span>{log.text}</span> <span style={{ color: 'var(--term-accent)', fontWeight: 'bold' }}>[{bar}] {log.progress}%</span>
              </div>
            );
          }
          if (log.type === 'text') {
            return (
              <div key={idx} className="terminal-log-row" style={{ color: log.color }}>
                {log.text}
              </div>
            );
          }
          if (log.type === 'html') {
            return (
              <div key={idx} className="terminal-log-row" dangerouslySetInnerHTML={{ __html: log.html }} />
            );
          }
          return null;
        })}

        {/* Live system telemetry rendering */}
        {telemetry && (
          <div className="terminal-log-row">
            <div style={{ fontFamily: 'monospace', border: '1px solid var(--border-card)', background: 'rgba(0,0,0,0.02)', padding: '16px', borderRadius: '12px', lineHeight: '1.6', color: 'var(--text-primary)' }}>
              <div style={{ color: 'var(--term-accent)', fontWeight: 'bold', borderBottom: '1.5px solid var(--border-subtle)', paddingBottom: '6px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between' }}>
                <span>⚡ OM-DEV SYSTEM TELEMETRY (v4.9.2)</span>
                <span style={{ animation: 'ota-spin 3s linear infinite' }}>⚙️</span>
              </div>
              <div>Environment       : <span style={{ fontWeight: 'bold', color: '#27C93F' }}>PRODUCTION (OTA-STABLE)</span></div>
              <div>Active Theme       : <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{telemetry.theme}</span></div>
              <div>Main Thread Latency: <span style={{ fontWeight: 'bold', color: '#27C93F' }}>{telemetry.latency}ms [OPTIMAL]</span></div>
              <div>Memory Heap Alloc : <span style={{ fontWeight: 'bold', color: 'var(--term-accent)' }}>{telemetry.memory}MB / 128MB</span>  [{telemetry.memBar}] {telemetry.memPct}%</div>
              <div>GPU Canvas Draw   : <span style={{ fontWeight: 'bold', color: '#27C93F' }}>{telemetry.fps} FPS [STABLE]</span>     [{telemetry.fpsBar}]</div>
              <div>OTA Bandwidth Rate: <span style={{ fontWeight: 'bold', color: '#27C93F' }}>{telemetry.bandwidth} KB/s [99.9% SAVINGS]</span></div>
              <div>Integrity Signature: <span style={{ fontFamily: 'Courier', fontSize: '0.8rem', opacity: 0.8 }}>sha256-a9f4c3de...</span></div>
              <div style={{ marginTop: '10px', fontSize: '0.75rem', borderTop: '1px dashed var(--border-subtle)', paddingTop: '6px', color: 'var(--text-secondary)', textAlign: 'center', fontStyle: 'italic' }}>
                Focus / Click input box to stop telemetry stream...
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Terminal Input Panel */}
      <div className="terminal-shell-line">
        <span className="terminal-prompt-prefix">{promptPrefix}</span>
        <input 
          ref={inputRef}
          id="terminal-input" 
          type="text" 
          value={inputVal}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          className="terminal-input" 
          placeholder={placeholder}
          disabled={isInstalling}
          autoComplete="off" 
          spellCheck="false" 
          aria-label="Terminal command execution line input box"
        />
      </div>
    </div>
  );
}
