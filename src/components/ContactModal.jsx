import React, { useState, useEffect } from 'react';

export default function ContactModal({ active, onClose, audioControls }) {
  const { playClick } = audioControls;
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [showFallbacks, setShowFallbacks] = useState(false);

  useEffect(() => {
    if (active) {
      document.body.style.overflow = 'hidden';
      setSubject("");
      setMessage("");
      setShowFallbacks(false);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [active]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && active) {
        playClick();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [active, onClose]);

  if (!active) return null;

  const handleProceed = () => {
    playClick();
    const recipient = 'ommanav.mail@gmail.com';
    const mailto = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    
    // Attempt to open mail app
    window.location.href = mailto;

    // Show fallback options in case no local mail app handles mailto
    setTimeout(() => {
      setShowFallbacks(true);
    }, 1200);
  };

  const handleCopy = () => {
    playClick();
    const fullText = `Subject: ${subject}\n\n${message}`;
    navigator.clipboard.writeText(fullText)
      .then(() => alert("Message copied to clipboard!"))
      .catch(() => alert("Could not copy message automatically."));
  };

  const handleGmailWeb = () => {
    playClick();
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=ommanav.mail@gmail.com&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    window.open(gmailUrl, '_blank');
  };

  return (
    <div 
      className="modal active" 
      id="contactModal" 
      onClick={(e) => { if (e.target.id === 'contactModal') onClose(); }}
      aria-hidden={!active}
    >
      <div className="modal-content">
        <button 
          onClick={onClose}
          className="modal-close border-none" 
          aria-label="Close message compose"
        >
          &times;
        </button>
        <div className="modal-title">
          <h2>Send a message</h2>
        </div>
        
        <div className="modal-body" style={{ padding: '18px 24px', background: 'var(--bg-card)', color: 'var(--text-primary)' }}>
          <label htmlFor="contactSubject" style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text-primary)' }}>
            Subject
          </label>
          <input 
            id="contactSubject" 
            type="text" 
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Short subject"
            style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-card)', marginBottom: '12px', fontSize: '14px', background: 'var(--bg-page)', color: 'var(--text-primary)', outline: 'none' }}
          />

          <label htmlFor="contactBody" style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text-primary)' }}>
            Message
          </label>
          <textarea 
            id="contactBody" 
            rows="6" 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your message here..."
            style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-card)', fontSize: '14px', background: 'var(--bg-page)', color: 'var(--text-primary)', outline: 'none', resize: 'none' }}
          />
        </div>

        <div className="modal-actions" style={{ padding: '12px 24px 20px', background: 'var(--bg-card)' }}>
          <button 
            onClick={handleProceed}
            className="modal-visit border-none"
          >
            Proceed
          </button>
        </div>

        {showFallbacks && (
          <div id="contactError" style={{ padding: '12px 24px 16px', background: 'var(--bg-card)', borderTop: '1px solid var(--border-subtle)' }}>
            <p style={{ margin: '0 0 8px', color: '#b45309', fontWeight: 600 }}>No mail app detected? Choose an option:</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button onClick={handleCopy} className="btn btn-secondary cursor-pointer">Copy message</button>
              <button onClick={handleGmailWeb} className="btn btn-secondary cursor-pointer">Open Gmail web</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
