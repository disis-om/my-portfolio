import React, { useState, useEffect, useRef } from 'react';

export default function OTAPanel({ active, onClose, currentVersion = '1.3.0', serverVersion = '1.3.1', onUpdateClick }) {
  const [view, setView] = useState('confirm'); // 'confirm' or 'progress'
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('Preparing environment...');
  const [logs, setLogs] = useState([]);
  const terminalEndRef = useRef(null);

  useEffect(() => {
    if (active) {
      setView('confirm');
      setProgress(0);
      setProgressText('Preparing environment...');
      setLogs([]);
    }
  }, [active]);

  useEffect(() => {
    if (view === 'progress' && terminalEndRef.current) {
      terminalEndRef.current.scrollTop = terminalEndRef.current.scrollHeight;
    }
  }, [logs, view]);

  const startInstallation = () => {
    setView('progress');
    setLogs([]);

    // Fetch active theme for logs
    const activeTheme = localStorage.getItem('om-dev-theme') || 'cream';

    const steps = [
      { t: 0, text: `[SYSTEM] Initiating core OTA update sequence...`, color: "var(--accent)" },
      { t: 800, text: `[SYSTEM] Fetching package blocks from repository origin/main...`, color: "var(--text-primary)" },
      { t: 2000, text: `[OK] Package verified. Retained build identifier: build_${serverVersion}_stable`, color: "#22c55e" },
      { t: 3200, text: `[SYS] Terminating background active scroll trackers... [OK]`, color: "var(--text-secondary)" },
      { t: 4500, text: `[SYS] Flashing cache manifest nodes & assets...`, color: "var(--text-primary)" },
      { t: 5800, text: `[OK] Local asset memory cache purged successfully.`, color: "#22c55e" },
      { t: 7200, text: `[SYS] Downloading new static bundle files (index.html)...`, color: "var(--accent)" },
      { t: 9000, text: `[OK] Static files parsed successfully. Compression ratio: 92.4%`, color: "#22c55e" },
      { t: 10500, text: `[SYS] Syncing theme-specific media components (videos/om.dev-${activeTheme}.mp4)...`, color: "var(--text-secondary)" },
      { t: 12500, text: `[OK] Ambient theme vector loops preloaded successfully.`, color: "#22c55e" },
      { t: 14000, text: `[SYS] Calibrating 3D perspective scroll metrics and matrix transforms...`, color: "var(--text-primary)" },
      { t: 15500, text: `[SYS] Shifting layout offsets to theme dynamic variables... [OK]`, color: "var(--text-secondary)" },
      { t: 17000, text: `[SYS] Performing security validation using SHA-256 signatures...`, color: "var(--accent)" },
      { t: 18500, text: `[OK] Verification signature validated. Hash matches original.`, color: "#22c55e" },
      { t: 19500, text: `[SYS] Flash complete. Rebuilding system boot manifests...`, color: "var(--accent)" },
      { t: 20000, text: `[OK] Kernel reboot initialized. Synced. Loading new build...`, color: "#22c55e" }
    ];

    // Append logs staggered by their time offsets
    steps.forEach(s => {
      setTimeout(() => {
        setLogs(prev => [...prev, { text: s.text, color: s.color }]);
      }, s.t);
    });

    const statusTexts = [
      "Flashing static assets...",
      "Verifying signature tags...",
      "Clearing cached indices...",
      "Synchronizing layout blocks...",
      "Calibrating system variables...",
      "Rebooting kernel engine..."
    ];

    let pct = 0;
    const timer = setInterval(() => {
      pct += 1;
      setProgress(pct);

      const textIndex = Math.floor(pct / 16.7);
      if (statusTexts[textIndex]) {
        setProgressText(statusTexts[textIndex]);
      }

      if (pct >= 100) {
        clearInterval(timer);
        setProgressText("Reboot concluded. Loading new build...");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    }, 200); // 20 seconds total
  };

  return (
    <div 
      id="kernel-update-overlay" 
      className={active ? 'active' : ''}
      style={{ display: active ? 'flex' : 'none' }}
    >
      <div className="ota-card">
        {view === 'confirm' ? (
          <div id="ota-confirm-view" style={{ display: 'flex', flexDirection: 'column', gap: '28px', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  background: 'var(--accent-soft)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent)',
                  flexShrink: 0,
                  transition: 'background 0.4s ease, color 0.4s ease'
                }}
              >
                <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
                </svg>
              </div>
              <div>
                <h2 className="ota-title">Update Available</h2>
                <p className="ota-description">A new firmware patch and visual build has been compiled.</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="ota-version-badge-container">
                <span className="ota-version-badge">Local: <span>v{currentVersion}</span></span>
                <span className="ota-version-arrow">→</span>
                <span className="ota-version-badge" style={{ background: 'var(--accent)', color: '#fff', padding: '3px 8px', borderRadius: '6px', transition: 'background 0.4s ease' }}>
                  Server: <span>v{serverVersion}</span>
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
                This over-the-air update stabilizes visual page layouts, synchronizes card scroll offsets, and calibrates environmental styling configurations dynamically.
              </p>
            </div>

            <div className="ota-actions">
              <button onClick={onClose} className="ota-btn ota-btn-secondary">Remind Later</button>
              <button onClick={onUpdateClick} className="ota-btn ota-btn-primary">Update Now</button>
            </div>
          </div>
        ) : (
          <div id="ota-progress-view" style={{ display: 'flex', flexDirection: 'column', gap: '28px', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div className="ota-spinner"></div>
              <div>
                <h2 className="ota-title" style={{ fontSize: '1.5rem' }}>Installing Update</h2>
                <p className="ota-description">Flashing visual firmware. Do not close or refresh the window.</p>
              </div>
            </div>

            {/* Terminal status box */}
            <div ref={terminalEndRef} className="ota-terminal-box">
              {logs.map((log, index) => (
                <div key={index} className="ota-terminal-row" style={{ color: log.color }}>
                  {log.text}
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="ota-progress-container">
              <div className="ota-progress-header">
                <span>{progressText}</span>
                <span>{progress}%</span>
              </div>
              <div className="ota-progress-bar-bg">
                <div className="ota-progress-bar-fill" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
