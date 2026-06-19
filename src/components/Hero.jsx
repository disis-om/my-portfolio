import React, { useState, useEffect, useRef } from 'react';

export default function Hero({ theme, audioControls, onConsoleToggle, onContactToggle, onChatToggle }) {
  const { playClick, playBoot } = audioControls;
  const heroRef = useRef(null);
  const buttonRef = useRef(null);

  // OS State Management
  const [osState, setOsState] = useState('off'); // 'off' | 'booting' | 'lockscreen' | 'signin' | 'desktop'
  const [bootProgress, setBootProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [menuDateTime, setMenuDateTime] = useState('');
  const [hoveredIndex, setHoveredIndex] = useState(null);

  // Control Center States
  const [brightness, setBrightness] = useState(100);
  const [volume, setVolume] = useState(80);
  const [wifiActive, setWifiActive] = useState(true);
  const [bluetoothActive, setBluetoothActive] = useState(true);
  const [controlCenterOpen, setControlCenterOpen] = useState(false);

  // Clock Update Effect (Synchronized with user's system time)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // 12-hour format
      const timeStr = `${hours}:${minutes} ${ampm}`;
      setCurrentTime(timeStr);

      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const dayName = days[now.getDay()];
      const monthName = months[now.getMonth()];
      const dayNum = now.getDate();
      setMenuDateTime(`${dayName} ${dayNum} ${monthName} ${timeStr}`);

      const options = { weekday: 'long', month: 'long', day: 'numeric' };
      setCurrentDate(now.toLocaleDateString('en-US', options));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Boot Loading Sequence Effect
  useEffect(() => {
    if (osState !== 'booting') return;

    setBootProgress(0);
    const duration = 2200; // 2.2 seconds loading speed
    const intervalTime = 40;
    const step = 100 / (duration / intervalTime);

    const interval = setInterval(() => {
      setBootProgress((prev) => {
        const next = prev + step;
        if (next >= 100) {
          clearInterval(interval);
          setOsState('lockscreen');
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [osState]);

  // 1. Giant Typography Proximity Distortion (Mouse for Desktop, Scroll for Mobile)
  useEffect(() => {
    const letters = document.querySelectorAll('.bg-letter');
    if (!letters.length) return;

    const updateDistortion = (clientX, clientY, isScrollTrigger = false) => {
      letters.forEach(letter => {
        const rect = letter.getBoundingClientRect();
        const letterX = rect.left + rect.width / 2;
        const letterY = rect.top + rect.height / 2;
        const dx = clientX - letterX;
        const dy = clientY - letterY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const activeTheme = document.documentElement.getAttribute('data-theme') || 'cream';
        const activeAccent = activeTheme === 'swiss' ? '#000000' : 'var(--accent)';

        const radius = isScrollTrigger ? 140 : 180;

        if (distance < radius) {
          const factor = (radius - distance) / radius;
          const weight = Math.round(300 + factor * 600); // 300 to 900
          const skew = factor * -12; // skew angle
          const scale = 1 + factor * 0.12; // size scale
          
          letter.style.fontWeight = weight.toString();
          letter.style.transform = `skewX(${skew}deg) scale(${scale})`;
          letter.style.color = activeAccent;
        } else {
          letter.style.fontWeight = '300';
          letter.style.transform = 'skewX(0deg) scale(1)';
          letter.style.color = '';
        }
      });
    };

    const handleMouseMove = (e) => {
      const isMobile = window.innerWidth <= 800;
      if (isMobile) return;
      updateDistortion(e.clientX, e.clientY, false);
    };

    const handleScroll = () => {
      const isMobile = window.innerWidth <= 800;
      if (!isMobile) return;

      const triggerX = window.innerWidth / 2;
      const triggerY = window.innerHeight * 0.45;
      updateDistortion(triggerX, triggerY, true);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial draw trigger
    handleScroll();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // 2. Magnetic CTA Button Effect
  useEffect(() => {
    const btn = buttonRef.current;
    if (!btn) return;

    const handleMouseMove = (e) => {
      const rect = btn.getBoundingClientRect();
      const btnX = rect.left + rect.width / 2;
      const btnY = rect.top + rect.height / 2;

      const dx = e.clientX - btnX;
      const dy = e.clientY - btnY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const radius = 75; // magnetic zone

      if (distance < radius) {
        const strength = 0.32;
        const x = dx * strength;
        const y = dy * strength;
        btn.style.transform = `translate3d(${x}px, ${y}px, 0) scale(1.04)`;
        btn.style.boxShadow = '0 12px 28px rgba(0, 0, 0, 0.15)';
      } else {
        btn.style.transform = 'translate3d(0, 0, 0) scale(1)';
        btn.style.boxShadow = '';
      }
    };

    const handleMouseLeave = () => {
      btn.style.transform = 'translate3d(0, 0, 0) scale(1)';
      btn.style.boxShadow = '';
    };

    window.addEventListener('mousemove', handleMouseMove);
    btn.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      btn.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const dockItems = [
    { name: "Finder", icon: "https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f70853981255cc36b3a37af_finder.png", action: onConsoleToggle },
    { name: "Siri", icon: "https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f70853ff3bafbac60495771_siri.png", action: onChatToggle },
    { name: "LaunchPad", icon: "https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f70853943597517f128b9b4_launchpad.png" },
    { name: "Contacts", icon: "https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f70853743597518c528b9b3_contacts.png", action: onContactToggle },
    { name: "Notes", icon: "https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f70853c849ec3735b52cef9_notes.png" },
    { name: "Reminders", icon: "https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f70853d44d99641ce69afeb_reminders.png" },
    { name: "Photos", icon: "https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f70853c55558a2e1192ee09_photos.png" },
    { name: "Messages", icon: "https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f70853a55558a68e192ee08_messages.png", action: onChatToggle },
    { name: "FaceTime", icon: "https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f708537f18e2cb27247c904_facetime.png", action: onContactToggle },
    { name: "Music", icon: "https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f70853ba0782d6ff2aca6b3_music.png" },
    { name: "Podcasts", icon: "https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f70853cc718ba9ede6888f9_podcasts.png" },
    { name: "TV", icon: "https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f708540dd82638d7b8eda70_tv.png" },
    { name: "App Store", icon: "https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f70853270b5e2ccfd795b49_appstore.png", action: () => {
      const el = document.getElementById('featured-projects');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }},
    { name: "Safari", icon: "https://uploads-ssl.webflow.com/5f7081c044fb7b3321ac260e/5f70853ddd826358438eda6d_safari.png", action: onConsoleToggle },
    { name: "Bin", icon: "https://findicons.com/files/icons/569/longhorn_objects/128/trash.png" }
  ];

  return (
    <section ref={heroRef} className="hero">
      {/* Background gradients and noise overlay */}
      <div className="liquid-mesh" style={{ opacity: 0.45 }}></div>
      <div className="noise-plate"></div>

      {/* Massive Typographic Proximity Background Playground */}
      <div className="editorial-bg-text-container" aria-hidden="true">
        <div className="bg-text-line">
          {"CREATIVE".split("").map((letter, idx) => (
            <span key={idx} className="bg-letter">{letter}</span>
          ))}
        </div>
        <div className="bg-text-line">
          {"DEVELOPER".split("").map((letter, idx) => (
            <span key={idx} className="bg-letter">{letter}</span>
          ))}
        </div>
      </div>

      {/* Hero Content grid */}
      <div className="hero-grid" style={{ zIndex: 10 }}>
        {/* Copy layout (Left side) */}
        <div className="hero-text-layer">
          <div className="hero-architecture-label" style={{ fontFamily: 'var(--font-body)', fontWeight: 700 }}>
            <span style={{ color: 'var(--accent)', marginRight: '6px' }}>//</span>
            EDITORIAL SPECIMEN v1.3.0
          </div>

          <h1 style={{ fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            Building with <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 300 }}>curiosity</span>.<br />
            Learning with <span style={{ color: 'var(--accent)', fontStyle: 'italic' }}>speed</span>.
          </h1>

          <p style={{ fontSize: '14.5px', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
            I am a self-taught creative developer crafting functional, high-fidelity digital interfaces. 
            Rejecting cookie-cutter design components in favor of precise typographic structures, dynamic states, and 
            custom micro-interactions. Every layout pixel represents an architectural choice.
            <span className="hero-credit" style={{ marginTop: '16px', fontWeight: 700, fontSize: '13px' }}>— OM RAJPUT</span>
          </p>

          <div className="hero-buttons" style={{ justifyContent: 'flex-start', marginTop: '12px' }}>
            <button 
              ref={buttonRef}
              className="btn btn-primary cursor-pointer border-none"
              style={{ transition: 'transform 0.1s ease, box-shadow 0.2s ease' }}
              onClick={() => {
                playClick();
                const el = document.getElementById('featured-projects');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Discover Works
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '8px' }}>
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Physical Computer Monitor Chassis (Right side) */}
        <div className="monitor-wrapper">
          <div className="monitor-bezel">
            <div className="monitor-screen">
              {/* Simulated hardware brightness overlay filter */}
              <div 
                className="os-brightness-overlay"
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundColor: '#000',
                  opacity: (100 - brightness) / 100,
                  pointerEvents: 'none',
                  zIndex: 9999
                }}
              />
              
              {/* 1. POWER OFF SCREEN */}
              {osState === 'off' && (
                <div className="os-screen-off">
                  <button 
                    className="monitor-power-btn" 
                    aria-label="Power On"
                    onClick={() => {
                      playClick();
                      setOsState('booting');
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="power-icon">
                      <path d="M18.36 6.64a9 9 0 1 1-12.73 0" />
                      <line x1="12" y1="2" x2="12" y2="12" />
                    </svg>
                  </button>
                </div>
              )}

              {/* 2. BOOTING SCREEN (Apple-style flagship loading screen) */}
              {osState === 'booting' && (
                <div className="os-boot-screen">
                  <div className="boot-content">
                    <div className="boot-logo">⌥</div>
                    <div className="boot-loader-container">
                      <div className="boot-loader-bar" style={{ width: `${bootProgress}%` }}></div>
                    </div>
                  </div>
                </div>
              )}

              {/* ACTIVE SYSTEM ENVIRONMENT LAYER (Lock Screen, Sign In, & Desktop Dock) */}
              {(osState === 'lockscreen' || osState === 'signin' || osState === 'desktop') && (
                <div className="os-desktop">
                  {/* CRT screen scanline filter texture */}
                  <div className="crt-scanlines"></div>

                  {/* 6. TOP MAC OS MENU BAR */}
                  {osState === 'desktop' && (
                    <div className="os-menu-bar">
                      <div className="left" style={{ gap: '6px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <div style={{ width: '4px', height: '4px', backgroundColor: '#fff', borderRadius: '50%' }}></div>
                        </div>
                        <span className="brand-mark uppercase" style={{ fontSize: '9.5px', fontWeight: 800, letterSpacing: '-0.04em', color: '#1e293b' }}>OM.DEV</span>
                      </div>
                      <div className="right">
                        <button 
                          className={`menu-ico-btn ${controlCenterOpen ? 'active' : ''}`}
                          onClick={() => {
                            playClick();
                            setControlCenterOpen(!controlCenterOpen);
                          }}
                          aria-label="Control Center"
                        >
                          <img src="https://eshop.macsales.com/blog/wp-content/uploads/2021/03/control-center-icon.png" alt="" className="control-center" />
                        </button>
                        <button 
                          className="menu-ico-btn"
                          onClick={() => {
                            playClick();
                            if (onChatToggle) onChatToggle();
                          }}
                          aria-label="Siri Assistant"
                        >
                          <img src="https://upload.wikimedia.org/wikipedia/en/8/8e/AppleSiriIcon2017.png" alt="" className="siri" />
                        </button>
                        <span className="menu-time">{menuDateTime}</span>
                      </div>
                    </div>
                  )}

                  {/* 7. MAC OS CONTROL CENTER DROPDOWN */}
                  {osState === 'desktop' && controlCenterOpen && (
                    <div className="os-control-center">
                      <div className="cc-grid">
                        <button 
                          className={`cc-tile ${wifiActive ? 'active' : ''}`}
                          onClick={() => setWifiActive(!wifiActive)}
                        >
                          <span className="cc-tile-icon">
                            <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                              <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                              <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                            </svg>
                          </span>
                          <div className="cc-tile-text">
                            <span className="title">Wi-Fi</span>
                            <span className="status">{wifiActive ? 'On' : 'Off'}</span>
                          </div>
                        </button>

                        <button 
                          className={`cc-tile ${bluetoothActive ? 'active' : ''}`}
                          onClick={() => setBluetoothActive(!bluetoothActive)}
                        >
                          <span className="cc-tile-icon">
                            <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M6.5 6.5l11 11L12 23V1l5.5 5.5-11 11" />
                            </svg>
                          </span>
                          <div className="cc-tile-text">
                            <span className="title">Bluetooth</span>
                            <span className="status">{bluetoothActive ? 'On' : 'Off'}</span>
                          </div>
                        </button>
                      </div>

                      <div className="cc-slider-block">
                        <span className="cc-slider-label">Display</span>
                        <div className="cc-slider-row">
                          <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="5" />
                            <line x1="12" y1="1" x2="12" y2="3" />
                            <line x1="12" y1="21" x2="12" y2="23" />
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                            <line x1="1" y1="12" x2="3" y2="12" />
                            <line x1="21" y1="12" x2="23" y2="12" />
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                          </svg>
                          <input 
                            type="range" 
                            min="20" 
                            max="100" 
                            value={brightness}
                            onChange={(e) => setBrightness(Number(e.target.value))}
                            className="cc-slider-input"
                          />
                        </div>
                      </div>

                      <div className="cc-slider-block">
                        <span className="cc-slider-label">Sound</span>
                        <div className="cc-slider-row">
                          <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                            <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                          </svg>
                          <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={volume}
                            onChange={(e) => setVolume(Number(e.target.value))}
                            className="cc-slider-input"
                          />
                        </div>
                      </div>

                      <div className="cc-power-row">
                        <button 
                          className="cc-power-btn restart"
                          onClick={() => {
                            playClick();
                            setControlCenterOpen(false);
                            setOsState('booting');
                          }}
                        >
                          Restart
                        </button>
                        <button 
                          className="cc-power-btn shutdown"
                          onClick={() => {
                            playClick();
                            setControlCenterOpen(false);
                            setOsState('off');
                          }}
                        >
                          Shut Down
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Minimalist branding emblem */}
                  <div className="desktop-branding">
                    <div className="logo-symbol">⌥</div>
                    <span className="logo-text">OmOS v1.0</span>
                  </div>

                  {/* 3. LOCK SCREEN LAYER (Slides up vertically when clicked) */}
                  <div className={`os-lock-screen ${osState !== 'lockscreen' ? 'unlocked' : ''}`} onClick={() => {
                    if (osState === 'lockscreen') {
                      playClick();
                      setOsState('signin');
                    }
                  }}>
                    <div className="lock-content">
                      <div className="lock-time">{currentTime}</div>
                      <div className="lock-date">{currentDate}</div>
                      <div className="lock-hint">Click anywhere to unlock</div>
                    </div>
                  </div>

                  {/* 4. SIGN IN USER INTERFACE */}
                  {osState === 'signin' && (
                    <div className="os-signin-screen">
                      <div className="signin-card">
                        <div className="signin-avatar">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="avatar-icon">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                        </div>
                        <div className="signin-user">Guest</div>
                        <button 
                          className="btn-signin"
                          onClick={() => {
                            if (playBoot) playBoot();
                            setOsState('desktop');
                          }}
                        >
                          Sign In
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 5. DESKTOP SYSTEM DOCK (Fully active post Sign In) */}
                  {osState === 'desktop' && (
                    <div className="os-dock-container">
                      <div 
                        className="os-dock"
                        onMouseLeave={() => setHoveredIndex(null)}
                      >
                        {dockItems.map((item, idx) => {
                          const isHovered = hoveredIndex === idx;
                          const isNeighbor1 = hoveredIndex !== null && Math.abs(hoveredIndex - idx) === 1;
                          const isNeighbor2 = hoveredIndex !== null && Math.abs(hoveredIndex - idx) === 2;

                          let scale = 1;
                          let translateY = 0;

                          if (isHovered) {
                            scale = 1.5;
                            translateY = -10;
                          } else if (isNeighbor1) {
                            scale = 1.25;
                            translateY = -6;
                          } else if (isNeighbor2) {
                            scale = 1.1;
                            translateY = -2;
                          }

                          const isBin = item.name === "Bin";

                          return (
                            <button
                              key={idx}
                              className={`dock-item ${isBin ? 'dock-bin-item' : ''}`}
                              style={{
                                transform: `scale(${scale}) translateY(${translateY}px)`,
                                margin: hoveredIndex !== null && Math.abs(hoveredIndex - idx) <= 1 ? '0 5px' : '0 1px',
                                transition: 'transform 0.2s cubic-bezier(0.25, 0.8, 0.25, 1), margin 0.2s ease',
                                transformOrigin: 'bottom center',
                              }}
                              onMouseEnter={() => setHoveredIndex(idx)}
                              onClick={() => {
                                playClick();
                                if (item.action) {
                                  item.action();
                                }
                              }}
                              aria-label={item.name}
                            >
                              <img className="ico" src={item.icon} alt={item.name} />
                              <span className="dock-tooltip">{item.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          {/* Physical Monitor Neck & Stand base */}
          <div className="monitor-stand"></div>
          <div className="monitor-base"></div>
        </div>
      </div>
    </section>
  );
}
