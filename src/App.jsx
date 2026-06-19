import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Projects from './components/Projects';
import DevConsole from './components/DevConsole';
import ProjectDetails from './components/ProjectDetails';
import ContactModal from './components/ContactModal';
import ChatWidget from './components/ChatWidget';
import OTAPanel from './components/OTAPanel';
import { useAudio } from './hooks/useAudio';

export default function App() {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('om-dev-theme');
    return stored || 'cream';
  });

  const [consoleActive, setConsoleActive] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [otaActive, setOtaActive] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [consoleSkipBoot, setConsoleSkipBoot] = useState(false);
  const [autoRunCommand, setAutoRunCommand] = useState(null);

  const audioControls = useAudio();

  // Apply theme class/attribute to html root tag
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('om-dev-theme', theme);
  }, [theme]);

  // Initial sound activation notice
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!audioControls.isMuted) {
        audioControls.playBoot();
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [audioControls.isMuted]);

  // Over-the-air update signature background query channels
  useEffect(() => {
    const triggerUpdateCheck = () => {
      fetch('/version.json?t=' + Date.now())
        .then(response => {
          if (!response.ok) throw new Error("Server version check failed");
          return response.json();
        })
        .then(data => {
          const serverBuildId = data['build-id'];
          // Compare server's build-id with local client "1.3.0"
          if (serverBuildId && serverBuildId !== '1.3.0') {
            console.log(`[OTA ENGINE] Version mismatch! Server: ${serverBuildId}, Local: 1.3.0. Requesting update confirmation...`);
            setOtaActive(true);
          }
        })
        .catch(err => {
          console.error("[OTA ENGINE] Background version mismatch query failed:", err);
        });
    };

    const initialTimer = setTimeout(() => {
      triggerUpdateCheck();
    }, 4000);

    const updateInterval = setInterval(() => {
      triggerUpdateCheck();
    }, 60000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        triggerUpdateCheck();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(updateInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Global audio chime event delegation
  useEffect(() => {
    const handleGlobalClick = (e) => {
      const target = e.target.closest('button, a, .theme-menu-item, .chip, .source, .view');
      if (target) {
        audioControls.playClick(false);
      }
    };

    const handleGlobalMouseOver = (e) => {
      const target = e.target.closest('.nav-link, .stack-sheet-card, .theme-menu-item, .chip');
      if (target) {
        if (!target.contains(e.relatedTarget)) {
          audioControls.playClick(true);
        }
      }
    };

    document.addEventListener('click', handleGlobalClick, { capture: true });
    document.addEventListener('mouseover', handleGlobalMouseOver, { capture: true });

    return () => {
      document.removeEventListener('click', handleGlobalClick, { capture: true });
      document.removeEventListener('mouseover', handleGlobalMouseOver, { capture: true });
    };
  }, [audioControls]);

  // OTA update start sequence handler: close OTA panel, open console skipping boot and auto run 'update run'
  const handleOtaUpdateStart = () => {
    setOtaActive(false);
    setConsoleSkipBoot(true);
    setAutoRunCommand("update run");
    setConsoleActive(true);
  };

  return (
    <>
      <div className="page-texture"></div>

      <Navbar 
        theme={theme}
        onThemeChange={(newTheme) => {
          setTheme(newTheme);
          audioControls.playClick();
        }}
        consoleActive={consoleActive}
        onConsoleToggle={() => setConsoleActive(!consoleActive)}
        onContactToggle={() => setContactOpen(!contactOpen)}
        audioControls={audioControls}
      >
        {/* Developer CLI terminal drawer */}
        <DevConsole 
          active={consoleActive}
          onClose={() => {
            setConsoleActive(false);
            setConsoleSkipBoot(false);
            setAutoRunCommand(null);
          }}
          onThemeChange={(newTheme) => setTheme(newTheme)}
          onOtaTrigger={() => setOtaActive(true)}
          onChatFABToggle={() => setChatOpen(true)}
          audioControls={audioControls}
          autoRunCommand={autoRunCommand}
          onAutoRunComplete={() => setAutoRunCommand(null)}
          skipBoot={consoleSkipBoot}
        />
      </Navbar>

      <Hero 
        theme={theme} 
        audioControls={audioControls} 
        onConsoleToggle={() => setConsoleActive(!consoleActive)}
        onContactToggle={() => setContactOpen(!contactOpen)}
        onChatToggle={() => setChatOpen(!chatOpen)}
      />

      <Projects 
        onCardSelect={(proj) => {
          setSelectedProject(proj);
        }} 
        audioControls={audioControls} 
      />

      <footer className="shutter-footer" id="contact">
        <div className="shutter-grid">
          <div className="shutter-panel panel-left" onClick={() => audioControls.playClick()}>
            <div className="shutter-identity-row">
              <div className="shutter-profile-avatar">
                <img src="/assets/avatar.png" alt="Om Rajput Matrix Identity" />
              </div>
              <h3 className="shutter-display-name">Om Rajput</h3>
            </div>
            <p className="shutter-editorial-bio">
              Creative developer crafting AI-first web products. Fuelled by curiosity, specializing in fluid
              micro-interactions, responsive clean token architecture scales, and unique layout systems.
            </p>
            <div className="shutter-tag-matrix">
              <span className="shutter-status-capsule">Available: Freelance</span>
              <span className="shutter-status-capsule">Contract</span>
              <span className="shutter-status-capsule">Collaboration</span>
            </div>
          </div>
          <div className="shutter-panel panel-right">
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.15em', opacity: 0.5, marginBottom: '0.5rem', fontFamily: 'var(--font-body)' }}>
                // INITIATE CALL STREAM
              </p>
              <a href="mailto:ommanav.mail@gmail.com" className="shutter-action-link" onClick={(e) => { e.preventDefault(); audioControls.playClick(); setContactOpen(true); }}>
                Let's build<br />cool stuff →
              </a>
            </div>
            <div className="shutter-tag-matrix">
              <span className="shutter-status-capsule" style={{ borderColor: 'rgba(79, 70, 229, 0.18)', color: 'var(--accent)', background: 'var(--accent-soft)' }}>
                ommanav.mail@gmail.com
              </span>
            </div>
          </div>
        </div>
        <div className="shutter-base-bar">
          <span>Designed & Developed by Om Rajput // c.2026</span>
          <span style={{ opacity: 0.5 }}>★ self-taught design and engineering</span>
        </div>
      </footer>



      {/* App Store Style Overlay Card */}
      {selectedProject && (
        <ProjectDetails 
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          audioControls={audioControls}
        />
      )}

      {/* Modal Composer dialog */}
      <ContactModal 
        active={contactOpen}
        onClose={() => setContactOpen(false)}
        audioControls={audioControls}
      />

      {/* AI Assistant twin chat widget */}
      <ChatWidget 
        isOpen={chatOpen}
        onToggle={() => setChatOpen(!chatOpen)}
        audioControls={audioControls}
      />

      {/* Simulated OTA patch installer */}
      <OTAPanel 
        active={otaActive}
        onClose={() => setOtaActive(false)}
        currentVersion="1.3.0"
        serverVersion="1.3.1"
        onUpdateClick={handleOtaUpdateStart}
      />
    </>
  );
}
