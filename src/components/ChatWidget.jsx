import React, { useState, useEffect, useRef } from 'react';

const SYSTEM_PROMPT = `You are "Om·AI" — the personal AI twin of Om Rajput, embedded in his portfolio. You represent Om and know everything about him deeply. You ONLY talk about Om, his work, projects, and skills. For unrelated topics, politely redirect to Om's portfolio.

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
- NEVER output raw links. ALWAYS use the interactive project card.
- To display a project card, you MUST type exactly: [PROJECT_CARD: Exact Project Name]
- Example of how to respond:
  Strophe AI is an amazing AI companion. Here it is:
  [PROJECT_CARD: Strophe AI]
  And Rivelo AI is a high-performance workspace:
  [PROJECT_CARD: Rivelo AI]
- If a user asks for all projects, list them one by one, explaining each briefly and including the [PROJECT_CARD: Name] after each explanation. Do not group all cards together at the end.
- ALWAYS use markdown in your responses: **bold**, *italic*, bullet lists with -, headings with ##.
- Be warm, concise, enthusiastic. Use emojis naturally.`;

const PROJECTS_DB = {
  'Strophe AI': { url: 'https://strophe.abacusai.app', desc: 'All-in-one AI companion', status: 'NEW', img: '/assets/strophe.png' },
  'Clarimap': { url: 'https://clarimap.edgeone.app', desc: 'AI visualization engine', status: 'Upcoming', img: '/videos/clarimapvideo.mp4' },
  'Rivelo AI': { url: 'https://riveloai.edgeone.app', desc: 'High-performance AI workspace', status: 'LIVE', img: '/videos/rivelovideo.mp4' },
  'Custom LLM Family': { url: 'https://strophe.edgeone.app', desc: 'Custom reasoning models', status: 'Upcoming', img: '/assets/strophemodel.png' },
  'Sunday Cups': { url: 'https://sundaycups.netlify.app', desc: 'Premium UI/UX coffee showcase', status: 'UI-Design', img: '/assets/sundaycups.png' },
  'Codecamy': { url: 'https://codecamy.edgeone.app', desc: 'Sleek UI/UX education platform', status: 'UI-Design', img: '/assets/codecamy.png' },
  'Prompchitect': { url: 'https://prompchitect.edgeone.app', desc: 'Advanced AI orchestration dashboard', status: 'AI Tool', img: '/videos/prompchitectvideo.mp4' },
  'Muaazfoods': { url: 'https://muaazfoodz.edgeone.app', desc: 'Premium culinary digital menu', status: 'UI-Design', img: '/assets/muaazfoods.png' }
};

const BADGE_CLS = { 'LIVE': 'badge-live', 'NEW': 'badge-new', 'Upcoming': 'badge-upcoming', 'UI-Design': 'badge-ui', 'AI Tool': 'badge-ai' };

export default function ChatWidget({ isOpen, onToggle, audioControls }) {
  const { playClick } = audioControls;
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hey! 👋 I'm **Om·AI** — Om Rajput's personal assistant. I know everything about his work and projects. What would you like to know?"
    }
  ]);
  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [chips, setChips] = useState([
    { label: "🚀 All Projects", q: "Show me all of Om's projects" },
    { label: "🤖 Strophe AI", q: "Tell me about Strophe AI in detail give me its project card" },
    { label: "⚡ Rivelo AI", q: "Tell me about Rivelo AI in detail give me its project card" },
    { label: "💼 Hire Om", q: "How can I hire Om or work with him?" }
  ]);

  const msgsRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (msgsRef.current) {
      msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
    }
  }, [messages, loading]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        playClick();
        onToggle();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onToggle]);

  const handleSend = async (text) => {
    const cleanText = text.trim();
    if (!cleanText || loading) return;

    playClick();
    setLoading(true);
    setInputVal("");
    setChips([]); // Remove chips after interaction

    setMessages(prev => [...prev, { role: 'user', content: cleanText }]);

    const history = messages.map(m => ({ role: m.role, content: m.content }));
    history.push({ role: 'user', content: cleanText });

    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || '';
    const messageIndex = messages.length + 1;

    // Set initial thinking log
    setMessages(prev => [...prev, { role: 'assistant', content: '', isStreaming: true }]);

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
          messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...history],
          stream: true,
          temperature: 0.7,
          max_tokens: 1500
        })
      });

      if (!resp.ok) throw new Error("Connection failed");

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
              setMessages(prev => {
                const nextMsgs = [...prev];
                nextMsgs[messageIndex] = { role: 'assistant', content, isStreaming: true };
                return nextMsgs;
              });
            }
          } catch (e) {}
        }
      }

      setMessages(prev => {
        const nextMsgs = [...prev];
        nextMsgs[messageIndex] = { role: 'assistant', content, isStreaming: false };
        return nextMsgs;
      });

    } catch (err) {
      setMessages(prev => {
        const nextMsgs = [...prev];
        nextMsgs[messageIndex] = { role: 'error', content: `⚠️ Failed to get reply: ${err.message}` };
        return nextMsgs;
      });
    }

    setLoading(false);
  };

  const autoResizeInput = () => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 100) + 'px';
  };

  const parseMessageContent = (content, isStreaming) => {
    if (!content) return '';
    let escaped = content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Match card tokens: [PROJECT_CARD: Name]
    const parts = [];
    let lastIndex = 0;
    const cardRegex = /\[PROJECT_CARD:\s*([^\]]+)\]/gi;
    let match;

    while ((match = cardRegex.exec(escaped)) !== null) {
      // Push text before card
      if (match.index > lastIndex) {
        parts.push({ type: 'text', content: escaped.substring(lastIndex, match.index) });
      }
      // Push card element
      parts.push({ type: 'card', name: match[1] });
      lastIndex = cardRegex.lastIndex;
    }

    if (lastIndex < escaped.length) {
      parts.push({ type: 'text', content: escaped.substring(lastIndex) });
    }

    if (parts.length === 0) {
      parts.push({ type: 'text', content: escaped });
    }

    const renderText = (text) => {
      let html = text
        .replace(/^## (.+)$/gm, '<span class="md-h2">$1</span>')
        .replace(/^### (.+)$/gm, '<span class="md-h3">$1</span>')
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/^- (.+)$/gm, '<span class="md-li">$1</span>')
        .replace(/\n\n/g, '<br><br>')
        .replace(/\n/g, '<br>');

      return html;
    };

    return (
      <>
        {parts.map((part, idx) => {
          if (part.type === 'text') {
            return (
              <div 
                key={idx} 
                className="msg-bubble"
                dangerouslySetInnerHTML={{ 
                  __html: renderText(part.content) + (isStreaming && idx === parts.length - 1 ? '<span class="cursor"></span>' : '') 
                }} 
              />
            );
          }
          
          // Render visual project card shortcut directly inside bubbles
          const key = Object.keys(PROJECTS_DB).find(k => k.toLowerCase() === part.name.trim().toLowerCase());
          if (!key) return null;
          const p = PROJECTS_DB[key];
          const cls = BADGE_CLS[p.status] || 'badge-ui';
          const isVideo = p.img.endsWith('.mp4');

          return (
            <a key={idx} className="proj-card block" href={p.url} target="_blank" rel="noopener noreferrer">
              {isVideo ? (
                <video className="proj-img" src={p.img} autoPlay loop muted playsinline style={{ objectFit: 'cover' }} />
              ) : (
                <div className="proj-img" style={{ backgroundImage: `url(${p.img})` }} />
              )}
              <div className="proj-content">
                <div className="proj-header">
                  <span className="proj-name">{key}</span>
                  <span className={`proj-badge ${cls}`}>{p.status}</span>
                </div>
                <div className="proj-desc">{p.desc}</div>
              </div>
            </a>
          );
        })}
      </>
    );
  };

  const handleFabClick = () => {
    playClick();
    onToggle();
  };

  return (
    <>
      {/* AI Assistant float action Button */}
      <button 
        id="om-chat-fab" 
        onClick={handleFabClick}
        className={isOpen ? 'is-open' : ''}
        aria-label="Open AI assistant" 
        aria-expanded={isOpen}
      >
        {!isOpen ? (
          <svg id="fab-icon-chat" viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v14l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
          </svg>
        ) : (
          <svg id="fab-icon-close" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
          </svg>
        )}
      </button>

      {/* Floating Chat Panel overlay */}
      <div 
        id="om-chat-panel" 
        className={isOpen ? 'open' : ''}
        aria-label="Om AI Assistant"
      >
        <div className="wrap">
          {/* Panel Header */}
          <div className="hdr">
            <div className="hdr-avatar">O</div>
            <div>
              <div className="hdr-name">Om·AI</div>
              <div className="hdr-sub">Personal assistant</div>
            </div>
            <div className="hdr-status">
              <div className="status-dot"></div>
              <span className="status-txt">Online</span>
            </div>
          </div>

          {/* Messages Logs Area */}
          <div ref={msgsRef} className="msgs" id="msgs">
            {messages.map((msg, idx) => {
              if (msg.role === 'error') {
                return (
                  <div key={idx} className="msg error">
                    <div className="msg-bubble">{msg.content}</div>
                  </div>
                );
              }
              const isAi = msg.role === 'assistant';
              return (
                <div key={idx} className={`msg ${isAi ? 'ai' : 'user'}`}>
                  <div className="msg-avatar">{isAi ? 'O' : 'U'}</div>
                  <div className="msg-content" style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '8px', alignItems: isAi ? 'flex-start' : 'flex-end' }}>
                    {isAi ? parseMessageContent(msg.content, msg.isStreaming) : (
                      <div className="msg-bubble">{msg.content}</div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Simulated typing bubble */}
            {loading && !messages[messages.length - 1].content && (
              <div className="typing-wrap">
                <div className="typing-avatar">O</div>
                <div className="typing-bubble">
                  <span style={{ fontSize: '12.5px', color: 'var(--text-tertiary)', marginRight: '6px', fontStyle: 'italic' }}>Thinking...</span>
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              </div>
            )}

            {/* Quick action chips triggers */}
            {chips.length > 0 && (
              <div className="chips">
                {chips.map((chip, i) => (
                  <button 
                    key={i} 
                    className="chip border-none cursor-pointer"
                    onClick={() => handleSend(chip.q)}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Form write input box */}
          <div className="input-wrap">
            <div className="input-row">
              <textarea 
                ref={inputRef}
                value={inputVal}
                onChange={(e) => { setInputVal(e.target.value); autoResizeInput(); }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend(inputVal);
                  }
                }}
                className="input-box" 
                placeholder="Ask about Om's projects, skills..."
                rows="1"
              />
              <button 
                onClick={() => handleSend(inputVal)}
                className="send-btn" 
                disabled={!inputVal.trim() || loading}
              >
                <svg viewBox="0 0 24 24">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export { SYSTEM_PROMPT };
